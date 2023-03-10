import express, { Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import * as http from 'http';
import Debug from 'debug';
import routes from './routes/index';
import { AppError } from '../../shared/Error/AppError';

type IAdapters = http.Server | Router;

class ServerHttp {
  private debug: Debug.IDebugger;
  private app: express.Application;
  private server: http.Server;
  private port: number | string;

  constructor(port: number | string) {
    this.debug = Debug('app:server');
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;
  }

  public adpter(AdapterInstance: IAdapters) {
    if (AdapterInstance instanceof http.Server) {
      this.server = AdapterInstance;
    }
    if (AdapterInstance instanceof Router) {
      this.app.use(AdapterInstance as Router);
    }
  }

  init() {
    this.middlerwares();
    this.routes();
    this.middlewareHandlerErrors();
    this.server.listen(this.port, () => {
      this.debug(`Server started on port ${this.port}`);
    });
  }

  routes() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(routes);
  }

  middlerwares() {
    // InLine Middlewares
    this.app.use(
      (request: Request, response: Response, _next: NextFunction) => {
        request.debug = this.debug;
        request.debug(`> ${request.path} -> Acess`);
        _next();
      },
    );
  }

  middlewareHandlerErrors() {
    this.app.use(
      (
        err: Error,
        request: Request,
        response: Response,
        _next: NextFunction,
      ) => {
        this.debug(err);
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }
        return response.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }

  close(callback: () => void) {
    this.server.close(callback);
  }

  getServer() {
    return this.server;
  }
}

export default ServerHttp;
