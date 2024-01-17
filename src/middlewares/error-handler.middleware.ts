import e, { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { StatusCodes } from 'http-status-codes';
import HttpError from '@errors/http.error';
import { logger } from '@common/logger';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: Error, req: Request, res: Response, next: (err?: never) => NextFunction): void {
        if (error instanceof HttpError) {
            res.status(error.getStatus()).json({
                errorCode: error.getErrorCode(),
                message: error.getMessage(),
                status: error.getStatus(),
                details: error.getDetails()
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorCode: HttpErrorCodes.INTERNAL_SERVER_ERROR,
                message: HttpErrorMessages.INTERNAL_SERVER_ERROR,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                details: []
            });
            logger.error(error);
        }
        next();
    }
}
