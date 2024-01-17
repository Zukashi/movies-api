import AddMovieDto from '@dtos/add-movie.dto';
import MovieService from '@services/movie.service';
import MoviesQueryParamsDto from '@dtos/movies-query-params.dto';
import { Movie } from '@interfaces/movie.interface';
import { response, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Post, QueryParams, Body, Res, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { validationMiddleware } from '@middlewares/validation.middleware';

@Service()
@Controller('/v1/movies')
export default class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    @UseBefore(validationMiddleware(MoviesQueryParamsDto, 'query'))
    public async getAllMovies(
        @QueryParams() queryParams: MoviesQueryParamsDto,
        @Res() res: Response
    ): Promise<Response> {
        const moviesData = await this.movieService.retrieveMovies(queryParams);
        const responseData = { movies: Array.isArray(moviesData) ? moviesData : [moviesData] };
        return res.status(StatusCodes.OK).json(responseData);
    }

    @Post()
    @UseBefore(validationMiddleware(AddMovieDto, 'body'))
    public async createMovie(@Body() addMovieDto: AddMovieDto, @Res() res: Response): Promise<Response> {
        const newMovie: Movie = await this.movieService.createMovie(addMovieDto);
        return res.status(StatusCodes.CREATED).json(newMovie);
    }
}
