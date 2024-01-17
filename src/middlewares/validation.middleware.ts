import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import HttpError from '@errors/http.error';
import { ValidationErrorFormatResult } from '@interfaces/validation-error-format-result.interface';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const formatValidationErrors = (validationErrors: ValidationError[]): ValidationErrorFormatResult[] => {
    return validationErrors.map((error) => {
        const messages = error.constraints ? Object.values(error.constraints) : [];
        return { field: error.property, value: error.value, messages };
    });
};

export const validationMiddleware = (
    type: any,
    value: 'body' | 'query',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const plainData = value === 'body' ? req.body : req.query;
        const obj = plainToInstance(type, plainData);

        const validationErrors = await validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted });

        if (validationErrors.length > 0) {
            next(
                new HttpError(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    HttpErrorCodes.UNPROCESSABLE_ENTITY,
                    HttpErrorMessages.DTO_VALIDATION_ERRORS_OCCURRED,
                    formatValidationErrors(validationErrors)
                )
            );
        } else {
            next();
        }
    };
};
