import { Singleton } from "typescript-ioc";

@Singleton
export class Configuration {
  public readonly PORT = 3000;
  public readonly REDIS = Object.freeze({
    PORT: 6379,
    HOST: 'localhost',
    PASSWORD: 'sOmE_sEcUrE_pAsS',
    SSL: false,
  });
}