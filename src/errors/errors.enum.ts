export enum ValidationMessages {
    INVALID_TITLE_LENGTH = 'title must be less than 255 characters',
    INVALID_YEAR = 'year must be a valid number',
    INVALID_RUNTIME = 'runtime must be a valid number',
    INVALID_GENRES = 'genres must contains only predefined values from db file'
}

export enum HttpErrorMessages {
    INTERNAL_SERVER_ERROR = 'Something went wrong on the server.',
    DTO_VALIDATION_ERRORS_OCCURRED = 'Errors occurred while validating DTO',
    REQUESTED_MOVIE_DOESNT_EXIST = "Requested movie doesn't exist in database",
    REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'Requested movie data already exists in database.'
}

export enum HttpErrorCodes {
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    REQUESTED_MOVIE_DOESNT_EXIST = 'REQUESTED_MOVIE_DOESNT_EXIST',
    REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB'
}
