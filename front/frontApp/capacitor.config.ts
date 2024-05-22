import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontApp',
  webDir: 'dist',
  server: {
    androidScheme: "http",
    allowNavigation: ["http://192.168.1.28:5001/"],
    cleartext: true,
  }
};

export default config;
