// environment.development.ts
import packageJson from '../../package.json';

export const environment = {
  production: false,
  envProfile: 'dev',
  apiBaseUrl: 'http://localhost:8080/',
};

// export class Environment {
//   public static version: string = packageJson.version;
//   public static envProfile = environment.envProfile;
//   public static apiBaseUrl = environment.apiBaseUrl;
// }
