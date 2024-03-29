import { Service } from 'typedi';
import { DbMovie, Movie } from '@interfaces/movie.interface';

@Service()
export class MovieTransformer {
    public transformDbMovieToMovie(dbMovie: DbMovie): Movie {
        const movie: Movie = {
            id: dbMovie.id,
            genres: dbMovie.genres,
            title: dbMovie.title,
            year: Number(dbMovie.year),
            runtime: Number(dbMovie.runtime),
            director: dbMovie.director,
            actors: dbMovie.actors,
            plot: dbMovie.plot,
            posterUrl: dbMovie.posterUrl
        };

        return movie;
    }

    public transformMovieToDbMovie(movie: Movie): DbMovie {
        const dbMovie: DbMovie = {
            id: movie.id,
            genres: movie.genres,
            title: movie.title,
            year: String(movie.year),
            runtime: String(movie.runtime),
            director: movie.director,
            actors: movie.actors,
            plot: movie.plot,
            posterUrl: movie.posterUrl
        };

        return dbMovie;
    }
}
