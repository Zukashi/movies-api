import { MovieRepository } from '@repos/movie.repository';
import AddMovieDto from '@dtos/add-movie.dto';
import { DbMovie, Movie } from '@interfaces/movie.interface';
import { MovieTransformer } from '@transformers/movie.transformer';
import { Service } from 'typedi';
import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import HttpError from '@errors/http.error';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import { logger } from '@common/logger';
import { LoggerEvents } from '@common/logger-events.enum';

@Service()
export default class MovieService {
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly movieTransformer: MovieTransformer
    ) {}

    public async retrieveMovies(queryParams: MoviesQueryParams): Promise<Movie[] | Movie> {
        const { duration, genres } = queryParams;
        if (duration && genres) {
            return await this.getAllMoviesNarrowedByRuntimeWithMatchingGenres(duration, genres);
        } else if (genres) {
            return await this.getAllMoviesMatchingGenres(genres);
        } else if (duration) {
            return await this.getOneRandomMovieWithinRuntimeRange(duration);
        } else {
            return await this.getOneRandomMovie();
        }
    }
    private async getOneRandomMovie(): Promise<Movie> {
        const dbMovie: DbMovie = await this.movieRepository.findOneRandomMovie();
        const movie: Movie = this.movieTransformer.transformDbMovieToMovie(dbMovie);
        return movie;
    }
    private async getOneRandomMovieWithinRuntimeRange(duration: number): Promise<Movie> {
        const dbMovie: DbMovie = await this.movieRepository.findOneRandomMovieInRuntimeRange(duration);
        if (!dbMovie) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                HttpErrorCodes.REQUESTED_MOVIE_DOESNT_EXIST,
                HttpErrorMessages.REQUESTED_MOVIE_DOESNT_EXIST,
                "Requested movie doesn't exist"
            );
        }
        const movie: Movie = this.movieTransformer.transformDbMovieToMovie(dbMovie);
        return movie;
    }
    private async getAllMoviesNarrowedByRuntimeWithMatchingGenres(
        duration: number,
        genres: string[]
    ): Promise<Movie[]> {
        const dbMovies: DbMovie[] = await this.movieRepository.findAllMoviesMatchingGenresAndNarrowedByRuntime(
            duration,
            genres
        );
        const movies: Movie[] = dbMovies.map((dbMovie) => this.movieTransformer.transformDbMovieToMovie(dbMovie));
        return movies;
    }

    private async getAllMoviesMatchingGenres(genres: string[]): Promise<Movie[]> {
        const dbMovies: DbMovie[] = await this.movieRepository.findAllMoviesMatchingGenres(genres);
        const movies: Movie[] = dbMovies.map((dbMovie) => this.movieTransformer.transformDbMovieToMovie(dbMovie));
        return movies;
    }

    public async createMovie(addMovieDto: AddMovieDto): Promise<Movie> {
        const dbMovies: DbMovie[] = await this.movieRepository.findAllMovies();
        const newMovieId: number = dbMovies.length + 1;
        const movie: Movie = { id: newMovieId, ...addMovieDto };
        const newDbMovie: DbMovie = this.movieTransformer.transformMovieToDbMovie(movie);
        const existingMovie: DbMovie = dbMovies.filter((existingMovie) =>
            this.areMoviesSimilar(newDbMovie, existingMovie)
        )[0];
        if (existingMovie) {
            throw new HttpError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                HttpErrorCodes.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
                HttpErrorMessages.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
                { movieFromDb: existingMovie }
            );
        }

        await this.movieRepository.saveMovie(newDbMovie);

        logger.info({ event: LoggerEvents.NEW_MOVIE_ADD, data: addMovieDto });

        return movie;
    }

    private areMoviesSimilar(existingMovie: DbMovie, newMovie: DbMovie): boolean {
        return (
            existingMovie.title === newMovie.title &&
            existingMovie.year === newMovie.year &&
            existingMovie.director === newMovie.director
        );
    }
}
