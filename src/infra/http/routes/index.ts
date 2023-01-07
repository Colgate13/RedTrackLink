import { Router, Response, Request } from 'express';
import 'express-async-errors';

export const routesCreator = Router();

const routes = Router();

routes.use('/', (request: Request, response: Response) => {
  response.send({
    message: 'Welcome',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: '/docs',
  });
});

export default routes;
