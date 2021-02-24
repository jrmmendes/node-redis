import Koa from 'koa';
import Router from 'koa-router';
import morgan from 'koa-morgan';
import { Container } from 'typescript-ioc';
import { Logger } from './logger';
import { Configuration } from './config';
import { CacheService } from './cache/cache.service';
import { DevToAPI } from './dev-to.api';

const logger = Container.get(Logger);
const config = Container.get(Configuration);
const cache = Container.get(CacheService);
const devAPI = Container.get(DevToAPI);

const app = new Koa();
const router = new Router();

router.get('/', async ({ request, response }) => {
  try {
    const cachedResponse = await cache.get('TEST');
    if (!cachedResponse) {
      logger.info('root route', 'Cached response not found.');
      const data = await devAPI.articles();
      await cache.add('TEST', data, 20);
      response.body = data;
    } else {
      logger.info('root route', 'Cached response found.');
      response.body = cachedResponse;
    }
    response.status = 200;
  } catch (error) {
    response.status = 400;
    response.body = { message: error.message };
  }
});

router.use(async ({ request, response }) => {
  response.status = 404;
  response.body = { message: 'Not Found' };
});

app.use(morgan('dev'));
app.use(router.routes());

app.listen(config.PORT, () => logger.info(
  'Express',
  `Application started at port ${config.PORT}`
));
