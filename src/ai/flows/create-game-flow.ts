
'use server';
/**
 * @fileOverview A flow to create a "spot the difference" game using AI.
 *
 * - createGame - Generates two similar images with subtle differences and identifies them.
 * - CreateGameInput - The input type for the createGame function.
 * - CreateGameOutput - The return type for the createGame function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreateGameInputSchema = z.object({
  topic: z.string().describe('The topic or theme for the images to be generated.'),
});
export type CreateGameInput = z.infer<typeof CreateGameInputSchema>;

const DifferenceSchema = z.object({
  id: z.number().describe('A unique ID for the difference.'),
  x: z.number().describe('The x-coordinate of the center of the difference, as a percentage of the image width.'),
  y: z.number().describe('The y-coordinate of the center of the difference, as a percentage of the image height.'),
  radius: z.number().describe('The radius of the circular area of the difference, as a percentage of the image width.'),
  description: z.string().describe('A brief description of what the difference is.'),
});

const CreateGameOutputSchema = z.object({
  topic: z.string().describe('The topic used for generation.'),
  image1: z.string().describe("The first generated image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  image2: z.string().describe("The second generated image, which has subtle differences from the first, as a data URI."),
  differences: z.array(DifferenceSchema).describe('An array of objects detailing the differences between the two images.'),
});
export type CreateGameOutput = z.infer<typeof CreateGameOutputSchema>;


export async function createGame(input: CreateGameInput): Promise<CreateGameOutput> {
  return createGameFlow(input);
}

const findDifferencesPrompt = ai.definePrompt({
    name: 'findDifferencesPrompt',
    input: {
        schema: z.object({
            image1: z.string(),
            image2: z.string(),
            description: z.string(),
        })
    },
    output: {
        schema: z.object({
            differences: z.array(DifferenceSchema),
        })
    },
    prompt: `You are an expert at playing "spot the difference" games.
You will be given two images and a text description of the changes made between image 1 and image 2.
Your task is to analyze the images and the description to precisely identify the location and bounding box of each difference.
Return the results in the requested structured format.

The coordinates (x, y) should represent the center of the difference.
The radius should be large enough to encircle the entire difference.
All values (x, y, radius) must be percentages of the image's width/height (e.g., 50 for 50%).

Image 1: {{media url=image1}}
Image 2: {{media url=image2}}
Description of differences:
{{{description}}}
`
});


const createGameFlow = ai.defineFlow(
  {
    name: 'createGameFlow',
    inputSchema: CreateGameInputSchema,
    outputSchema: CreateGameOutputSchema,
  },
  async (input) => {
    const { topic } = input;
    const numDifferences = 7; 

    // Step 1: Generate the first image.
    const { media: image1Media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a fun, cartoon-style, vibrant, kid-friendly image about: ${topic}. The image should be rich in detail and suitable for a "spot the difference" game.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!image1Media) {
      throw new Error('Failed to generate the first image.');
    }
    const image1 = image1Media.url;

    // Step 2: Generate the second image with differences and get a text description of them.
    const { output: image2Output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { media: { url: image1 } },
            { text: `This is the original image. Create a new version of this image with exactly ${numDifferences} subtle and small changes suitable for a "spot the difference" game. The changes should not be glaringly obvious. For example, you can change a color, add a small object, remove a small object, or change a facial expression.

You MUST also provide a simple, bulleted list describing each change you made. Do not provide coordinates, just describe the changes in plain text.` },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    
    if (!image2Output.media || !image2Output.text) {
        throw new Error('Failed to generate the second image or the differences description.');
    }
    const image2 = image2Output.media[0].url;
    const differencesDescription = image2Output.text;

    // Step 3: Analyze the two images and the description to get structured difference data.
    const { output: structuredOutput } = await findDifferencesPrompt({
        image1,
        image2,
        description: differencesDescription,
    });

    if (!structuredOutput || !structuredOutput.differences) {
        throw new Error('Failed to analyze the images and extract differences.');
    }

    return {
      topic,
      image1,
      image2,
      differences: structuredOutput.differences,
    };
  }
);
