import packageJson from "../../package.json";

export const environment = {
  production: true,
  envProfile: "office",
  apiBaseUrl: "http://172.17.56.192:8086/",
};

// export class Environment {
//   public static version: string = packageJson.version;
//   public static envProfile = environment.envProfile;
//   public static apiBaseUrl = environment.apiBaseUrl;
// }
