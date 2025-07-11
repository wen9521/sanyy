import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: '大家来找茬',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
