import Koa from 'koa';
import Router from 'koa-router';
import morgan from 'koa-morgan';

const app = new Koa();
const router = new Router();

router.get('/', async ({ request, response }) => {
  response.status = 200;
  response.body = { message: 'Hello world' };
});

app.use(morgan('dev'));
app.use(router.routes());

app.listen(3000, () => console.log('Application started!'));
