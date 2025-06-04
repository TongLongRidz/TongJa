import packageJson from "../../../package.json";
import { environment } from "../../environments/environment.office";

export class Environment {
  public static version: string = packageJson.version;
  public static envProfile = environment.envProfile;
  public static apiBaseUrl = environment.apiBaseUrl;
}
