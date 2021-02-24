import { Inject, Singleton } from "typescript-ioc";
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

import { Configuration } from "../config";
import { Logger } from "../logger";

@Singleton
export class CacheService {
  @Inject private config: Configuration;

  @Inject private logger: Logger;

  private readonly client: RedisClient;

  private isHealthy: boolean;

  constructor() {
    this.client = redis.createClient(
      this.config.REDIS.PORT,
      this.config.REDIS.HOST,
      {
        tls: this.config.REDIS.SSL,
        prefix: `API:`,
        password: this.config.REDIS.PASSWORD,
        retry_strategy: (options) => {
          const { error, total_retry_time, attempt } = options;
          if (error && error.code === "ECONNREFUSED") {
            this.logger.error('redis', error.code); // take actions or throw exception
          }
          if (total_retry_time > 1000 * 15) { //in ms i.e. 15 sec
            this.logger.warn('Redis', 'timeout')
          }
          if (attempt > 10) {
            this.logger.warn('Redis', '10 attempts done'); // take actions or throw exception
          }
          this.logger.info('redis', 'Attempting connection');
          // reconnect after
          return Math.min(attempt * 100, 3000); //in ms
        },
      }
    );

    this.client.on('ready', () => {
      this.logger.info(
        'Cache Service',
        'Redis is ready'
      );

      this.isHealthy = true;
    });

    this.client.on('error', (error) => {
      this.logger.error(
        'Cache Service',
        'Redis error: ' + error.message
      );
      this.isHealthy = false;
    });
  }

  async add<T>(key: string, value: T, tls: number = 0): Promise<T | void> {
    if (!this.isHealthy) return;
    if (tls > 0) {
      this.logger.info('Cache Service', `Caching to key ${key} with TLS=${tls}`);
      return promisify(this.client.setex)
        .call(this.client, key, tls, JSON.stringify(value));
    }
    this.logger.info('Cache Service', `Caching to key ${key} without TLS`);
    return promisify(this.client.set)
      .call(this.client, key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | void> {
    if (!this.isHealthy) return;
    try {
      const data = await promisify(this.client.get)
        .call(this.client, key);
      return JSON.parse(data);
    } catch (error) {
      this.logger.error('Cache Service', error.message)
    }
  }
  async del(key: string) {
    ///...
  }
}