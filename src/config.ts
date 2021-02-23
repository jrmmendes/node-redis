import { Singleton } from "typescript-ioc";

@Singleton
export class Configuration {
  public readonly port = 3000;
}