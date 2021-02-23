import { Singleton } from "typescript-ioc";
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

@Singleton
export class Cache {
  private readonly client: RedisClient;
  constructor() {
    this.client = redis.createClient();
  }
}