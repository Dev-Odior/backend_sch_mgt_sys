import { Response, NextFunction, ErrorRequestHandler, Request } from 'express';
import Joi from 'joi';
import { serverConfig } from '@src/configs';
import { SystemError } from '@src/errors';
import { RequestValidator } from '@src/interfaces/functions.interface';

class SystemMiddleware {
  public errorHandler(): ErrorRequestHandler {
    return (error, req: Request, res: Response, next: NextFunction) => {
      const isProduction = serverConfig.NODE_ENV === 'production';

      const errorCode =
        error.code != null && Number(error.code) >= 100 && Number(error.code) <= 599
          ? error.code
          : 500;

      let errorMessage: SystemError | object = {};

      if (res.headersSent) {
        next(error);
      }

      if (!isProduction) {
        serverConfig.DEBUG(error.stack);
        errorMessage = error;
      }

      if (serverConfig.NODE_ENV === 'development') console.log(error);

      if (error instanceof Joi.ValidationError) {
        res.status(400).json({
          message: 'Validation error',
          error: error.details.map((detail) => detail.message),
        });
      }

        if (errorCode === 500 && isProduction) {
          res.status(500).json({
            message: 'An unexpected error occurred. Please try again later.',
          });
        }

      res.status(errorCode).json({
        message: error.message,
        error: {
          ...(error.errors && { error: error.errors }),
          ...(!isProduction && { trace: errorMessage }),
        },
      });
    };
  }

  public formatRequestQuery(req: Request, _res: Response, next: NextFunction) {
    try {
      const {
        query: { limit, offset, search },
      } = req;

      req.queryOpts = {
        limit: Number(limit) ? Number(limit) : 10,
        offset: Number(offset) ? Number(offset) : 0,
        search: search ? (search as string) : undefined,
      };
      return next();
    } catch (error) {
      serverConfig.DEBUG(`Error in system middleware format request query: ${error}`);
      return next(error);
    }
  }

  
  formatRequestParamId(param: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        const { params, paramIds } = req;

        req.paramIds = { ...paramIds };
        req.paramIds[`${param}`] = Number(params[param]);

        return next();
      } catch (error) {
        serverConfig.DEBUG(`Error in system middleware validate request param Id: ${error}`);
        next(error);
      }
    };
  }



  // public formatRequestParamIds(req: Request, _res: Response, next: NextFunction) {
  //   try {
  //     const formattedParams: { [key: string]: number } = {};
  //     Object.entries(req.params).forEach(([key, value]) => {
  //       if (key === 'id') {
  //         formattedParams[key] = Number(value);
  //   }
  //     });
  //     req.paramIds = formattedParams;
  //     return next();
  //   } catch (error) {
  //     serverConfig.DEBUG(`Error in system middleware format request params: ${error}`);
  //     return next(error);
  //   }
  // }



  public validateRequestBody(validator: RequestValidator) {
    
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = validator(req);

      if (error) throw error;
      req.body = value;

      next();
    };
  }
}

export default new SystemMiddleware();