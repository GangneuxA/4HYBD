import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontApp',
  webDir: 'dist',
  server: {
    androidScheme: "http",
    iosScheme: "https"
  }
};

export default config;
