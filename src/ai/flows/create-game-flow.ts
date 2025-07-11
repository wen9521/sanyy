
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


const createGameFlow = ai.defineFlow(
  {
    name: 'createGameFlow',
    inputSchema: CreateGameInputSchema,
    outputSchema: CreateGameOutputSchema,
  },
  async (input) => {
    const { topic } = input;
    const numDifferences = 7; // Let's generate 7 differences.

    // Step 1: Generate the first image.
    const { media: image1 } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a fun, cartoon-style, vibrant, kid-friendly image about: ${topic}. The image should be rich in detail and suitable for a "spot the difference" game.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!image1) {
      throw new Error('Failed to generate the first image.');
    }
    
    // Step 2: Generate the second image with differences.
    const { output: structuredOutput } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: image1.url } },
        { text: `This is the original image. Create a new version of this image with exactly ${numDifferences} subtle and small changes suitable for a "spot the difference" game. The changes should not be glaringly obvious. For example, you can change a color, add a small object, remove a small object, or change a facial expression.

You MUST also provide the locations and descriptions of the differences you made in the structured output.` },
      ],
      output: {
        schema: CreateGameOutputSchema,
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!structuredOutput || !structuredOutput.image2 || !structuredOutput.differences) {
        throw new Error('Failed to generate the second image or the differences.');
    }

    return {
      topic,
      image1: image1.url,
      image2: structuredOutput.image2,
      differences: structuredOutput.differences,
    };
  }
);
