import { AddMovie, DbMovie, Movie } from '@interfaces/movie.interface';
import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import { MovieTransformer } from '@transformers/movie.transformer';
import { MovieRepository } from '@repos/movie.repository';
import MovieService from '@services/movie.service';
import { expect } from 'chai';
import sinon from 'sinon';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';

describe('MovieService', () => {
    describe('getMovies', async () => {
        it("Should return a single random movie if query.duration and query.genres weren't specified", async () => {
            const queryParams: MoviesQueryParams = {};
            const expectedResponse: Movie = {
                id: 44,
                title: 'Gran Torino',
                year: 2008,
                runtime: 116,
                genres: ['Drama'],
                director: 'Clint Eastwood',
                actors: 'Clint Eastwood, Christopher Carley, Bee Vang, Ahney Her',
                plot: "Disgruntled Korean War veteran Walt Kowalski sets out to reform his neighbor, a Hmong teenager who tried to steal Kowalski's prized possession: a 1972 Gran Torino.",
                posterUrl:
                    'http://ia.media-imdb.com/images/M/MV5BMTQyMTczMTAxMl5BMl5BanBnXkFtZTcwOTc1ODE0Mg@@._V1_SX300.jpg'
            };

            const dbMovie: DbMovie = {
                id: 44,
                title: 'Gran Torino',
                year: '2008',
                runtime: '116',
                genres: ['Drama'],
                director: 'Clint Eastwood',
                actors: 'Clint Eastwood, Christopher Carley, Bee Vang, Ahney Her',
                plot: "Disgruntled Korean War veteran Walt Kowalski sets out to reform his neighbor, a Hmong teenager who tried to steal Kowalski's prized possession: a 1972 Gran Torino.",
                posterUrl:
                    'http://ia.media-imdb.com/images/M/MV5BMTQyMTczMTAxMl5BMl5BanBnXkFtZTcwOTc1ODE0Mg@@._V1_SX300.jpg'
            };
            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'findOneRandomMovie').resolves(dbMovie);
            const movieTransformer: MovieTransformer = new MovieTransformer();
            const movieService: MovieService = new MovieService(movieRepository, movieTransformer);

            const movie: Movie = (await movieService.retrieveMovies(queryParams)) as Movie;

            expect(movie).to.eql(expectedResponse);

            sinon.restore();
        });

        it('Should return an array of movies matching genres if only query.genres param was specified', async () => {
            const queryParams: MoviesQueryParams = { genres: ['Thriller', 'Horror'] };
            const expectedResponse: Movie[] = [
                {
                    id: 57,
                    genres: ['Horror', 'Mystery', 'Thriller'],
                    title: 'Psycho',
                    year: 1960,
                    runtime: 109,
                    director: 'Alfred Hitchcock',
                    actors: 'Anthony Perkins, Vera Miles, John Gavin, Janet Leigh',
                    plot: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BMDI3OWRmOTEtOWJhYi00N2JkLTgwNGItMjdkN2U0NjFiZTYwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
                },
                {
                    id: 5,
                    genres: ['Drama', 'History', 'Thriller'],
                    title: 'Valkyrie',
                    year: 2008,
                    runtime: 121,
                    director: 'Bryan Singer',
                    actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
                    plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
                    posterUrl:
                        'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg'
                },
                {
                    id: 8,
                    genres: ['Mystery', 'Thriller'],
                    title: 'Memento',
                    year: 2000,
                    runtime: 113,
                    director: 'Christopher Nolan',
                    actors: 'Guy Pearce, Carrie-Anne Moss, Joe Pantoliano, Mark Boone Junior',
                    plot: "A man juggles searching for his wife's murderer and keeping his short-term memory loss from being an obstacle.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
                }
            ];

            const dbMovies: DbMovie[] = [
                {
                    id: 57,
                    genres: ['Horror', 'Mystery', 'Thriller'],
                    title: 'Psycho',
                    year: '1960',
                    runtime: '109',
                    director: 'Alfred Hitchcock',
                    actors: 'Anthony Perkins, Vera Miles, John Gavin, Janet Leigh',
                    plot: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BMDI3OWRmOTEtOWJhYi00N2JkLTgwNGItMjdkN2U0NjFiZTYwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
                },
                {
                    id: 5,
                    genres: ['Drama', 'History', 'Thriller'],
                    title: 'Valkyrie',
                    year: '2008',
                    runtime: '121',
                    director: 'Bryan Singer',
                    actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
                    plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
                    posterUrl:
                        'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg'
                },
                {
                    id: 8,
                    genres: ['Mystery', 'Thriller'],
                    title: 'Memento',
                    year: '2000',
                    runtime: '113',
                    director: 'Christopher Nolan',
                    actors: 'Guy Pearce, Carrie-Anne Moss, Joe Pantoliano, Mark Boone Junior',
                    plot: "A man juggles searching for his wife's murderer and keeping his short-term memory loss from being an obstacle.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
                }
            ];
            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(dbMovies);
            const movieTransformer: MovieTransformer = new MovieTransformer();
            const movieService: MovieService = new MovieService(movieRepository, movieTransformer);
            const movies: Movie[] = (await movieService.retrieveMovies(queryParams)) as Movie[];

            expect(movies).to.eql(expectedResponse);

            sinon.restore();
        });
    });

    it('Should return array of movies matching genres and narrowed by runtime if query.duration and query.genres were specified', async () => {
        const queryParams: MoviesQueryParams = { duration: 68, genres: ['Animation', 'Adventure', 'Comedy'] };

        const movieRepository: MovieRepository = new MovieRepository();
        const movieMapper: MovieTransformer = new MovieTransformer();
        const movieService: MovieService = new MovieService(movieRepository, movieMapper);
        const movies: Movie[] = (await movieService.retrieveMovies(queryParams)) as Movie[];

        movies.forEach((movie) => {
            expect(movie).to.include.keys(
                'id',
                'genres',
                'title',
                'year',
                'runtime',
                'director',
                'actors',
                'plot',
                'posterUrl'
            );
            expect(movie.runtime).to.be.at.most(78);
            expect(movie.runtime).to.be.at.least(58);
            expect(movie.genres.some((genre) => ['Animation', 'Adventure', 'Comedy'].includes(genre))).to.be.true;
        });
        const uniqueMovies = new Set(movies.map((movie) => movie.id));
        expect(uniqueMovies.size).to.equal(movies.length);
    });

    it('Should return a single random movie in runtime range if only query.duration param was specified', async () => {
        const queryParams: MoviesQueryParams = { duration: 200 };
        const expectedResponse: Movie = {
            id: 77,
            title: 'The Lord of the Rings: The Return of the King',
            year: 2003,
            runtime: 201,
            genres: ['Action', 'Adventure', 'Drama'],
            director: 'Peter Jackson',
            actors: 'Noel Appleby, Ali Astin, Sean Astin, David Aston',
            plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            posterUrl:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BMjE4MjA1NTAyMV5BMl5BanBnXkFtZTcwNzM1NDQyMQ@@._V1_SX300.jpg'
        };

        const dbMovie: DbMovie = {
            id: 77,
            title: 'The Lord of the Rings: The Return of the King',
            year: '2003',
            runtime: '201',
            genres: ['Action', 'Adventure', 'Drama'],
            director: 'Peter Jackson',
            actors: 'Noel Appleby, Ali Astin, Sean Astin, David Aston',
            plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            posterUrl:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BMjE4MjA1NTAyMV5BMl5BanBnXkFtZTcwNzM1NDQyMQ@@._V1_SX300.jpg'
        };

        const movieRepository: MovieRepository = new MovieRepository();
        sinon.stub(movieRepository, 'findOneRandomMovieInRuntimeRange').resolves(dbMovie);
        const movieMapper: MovieTransformer = new MovieTransformer();
        const movieService: MovieService = new MovieService(movieRepository, movieMapper);
        const movie: Movie = (await movieService.retrieveMovies(queryParams)) as Movie;

        expect(movie).to.eql(expectedResponse);

        sinon.restore();
    });

    describe('addMovie', () => {
        it('Should return an error if the same movie with the given data already exists in db', async () => {
            const newMovie: AddMovie = {
                title: 'Oldboy',
                year: 2003,
                runtime: 120,
                genres: ['Drama', 'Mystery', 'Thriller'],
                director: 'Chan-wook Park',
                actors: 'Min-sik Choi, Ji-tae Yu, Hye-jeong Kang, Dae-han Ji',
                plot: 'After being kidnapped and imprisoned for 15 years, Oh Dae-Su is released, only to find that he must find his captor in 5 days.',
                posterUrl:
                    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_SX300.jpg'
            };
            const movieRepository: MovieRepository = new MovieRepository();
            const movieTransformer: MovieTransformer = new MovieTransformer();
            const movieService: MovieService = new MovieService(movieRepository, movieTransformer);

            try {
                await movieService.createMovie(newMovie);
            } catch (error: any) {
                expect(error.errorCode).is.equal(HttpErrorCodes.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB);
                expect(error.status).is.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                expect(error.message).is.equal(HttpErrorMessages.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB);
                return;
            }
        });

        it('Should return a new created movie if the same movie with the given data does not already exist in db', async () => {
            const newMovie: AddMovie = {
                title: 'new Movie test',
                year: 2024,
                runtime: 140,
                genres: ['Action', 'Sci-Fi'],
                director: 'Test directors',
                actors: 'Test actors',
                plot: 'Test plot',
                posterUrl: 'Test poster'
            };
            const expectedResponse: Movie = {
                id: 148,
                ...newMovie
            };

            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'saveMovie');
            const movieTransformer: MovieTransformer = new MovieTransformer();
            const movieService: MovieService = new MovieService(movieRepository, movieTransformer);
            const savedMovie: Movie = await movieService.createMovie(newMovie);
            expect(savedMovie).to.eql(expectedResponse);
            sinon.restore();
        });
    });
});
