import Koa from 'koa';
import Router from 'koa-router';
import morgan from 'koa-morgan';
import { Container } from 'typescript-ioc';
import { Logger } from './logger';
import { Configuration } from './config';

const logger = Container.get(Logger);
const config = Container.get(Configuration);

const app = new Koa();
const router = new Router();

router.get('/', async ({ request, response }) => {
  response.status = 200;
  response.body = { message: 'Hello world' };
});

app.use(morgan('dev'));
app.use(router.routes());

app.listen(config.port, () => logger.info(
  'Express',
  `Application started at port ${config.port}`
));
