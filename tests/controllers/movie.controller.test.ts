import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { AddMovie, DbMovie, Movie } from '@interfaces/movie.interface';
import { StatusCodes } from 'http-status-codes';
import { server } from '../../src';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import { join } from 'path';
import fs from 'fs';
import JsonDatabase from '@interfaces/json-database.interface';

chai.use(chaiHttp);

describe('MoviesController', () => {
    describe('getMovies', () => {
        it('Should return a status 200 and an array with a single movie if no query parameters are specified', (done) => {
            chai.request(server)
                .get('/v1/movies')
                .end((err, res) => {
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys('movies');
                    expect(body.movies).to.be.an('array').that.is.not.empty;
                    expect(body.movies).to.have.lengthOf(1);
                    expect(res.status).to.equal(StatusCodes.OK);

                    body.movies.forEach((movie: DbMovie) => {
                        expect(movie).to.be.an('object');
                        expect(movie).to.have.all.keys(
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
                    });

                    done();
                });
        });

        it('Should return an array of movies ordered by a number of matching genres when only the query.genres param was specified and a status 200', (done) => {
            chai.request(server)
                .get('/v1/movies?genres=Sci-Fi&genres=Drama&genres=Comedy')
                .end((err, res) => {
                    const { body } = res;

                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys('movies');
                    expect(body.movies).to.be.an('array').length(125);
                    expect(res.status).to.equals(StatusCodes.OK);

                    for (const movie of body.movies) {
                        expect(movie).to.have.all.keys([
                            'id',
                            'genres',
                            'title',
                            'year',
                            'runtime',
                            'director',
                            'actors',
                            'plot',
                            'posterUrl'
                        ]);
                    }

                    done();
                });
        });

        it('Should return a single random movie of specified runtime when only the query.duration parameter is specified and status 200', (done) => {
            chai.request(server)
                .get('/v1/movies?duration=140')
                .end((err, res) => {
                    const { body } = res;

                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys('movies');
                    expect(body.movies).to.be.an('array').length(1);
                    expect(res.status).to.equals(StatusCodes.OK);

                    body.movies.forEach((movie: DbMovie) => {
                        expect(movie).to.be.an('object');
                        expect(movie).to.have.all.keys(
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
                    });
                    done();
                });
        });

        it('Should return an array of movies matching genres narrowed by runtime if both query.duration and query.genres were specified and a status 200', (done) => {
            chai.request(server)
                .get('/v1/movies?genres=Animation&genres=Drama&genres=Mystery&duration=150')
                .end((err, res) => {
                    expect(res.body).to.be.an('object').with.property('movies').that.is.an('array').with.lengthOf(15);
                    expect(res).to.have.status(StatusCodes.OK);

                    res.body.movies.forEach((movie: DbMovie) => {
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
                    });
                    done();
                });
        });

        it('Returns an error with details for invalid query parameters and a status of 422', (done) => {
            const expectedErrorDetails = [
                {
                    messages: ['duration must not be less than 10'],
                    field: 'duration',
                    value: 6
                }
            ];

            chai.request(server)
                .get('/v1/movies?genres=Animation&genres=Drama&genres=Mystery&duration=6')
                .end((err, res) => {
                    expect(res).to.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.be.an('object').that.includes.keys('errorCode', 'message', 'status', 'details');
                    expect(res.body.details).to.deep.equal(expectedErrorDetails);
                    done();
                });
        });
    });
    describe('addMovie', () => {
        after(async () => {
            const dbTestPath: string = join(process.cwd(), process.env.TEST_DB_PATH as string);
            const fileContents = await fs.promises.readFile(dbTestPath);
            const jsonTestDb: JsonDatabase = await JSON.parse(fileContents.toString());
            jsonTestDb.movies.pop();
            const jsonUpdatedDb: string = JSON.stringify(jsonTestDb, null, 3);
            await fs.promises.writeFile(dbTestPath, jsonUpdatedDb);
        });

        it('Should add a new movie and return the movie object with a 201 status', (done) => {
            const newMovie: AddMovie = {
                genres: ['Action', 'Sci-Fi'],
                title: 'Test',
                year: 2024,
                runtime: 140,
                director: 'test directors',
                actors: 'test actors',
                plot: 'test plot',
                posterUrl: 'test poster'
            };
            const expectedResponse: Movie = {
                id: 148,
                ...newMovie
            };

            chai.request(server)
                .post('/v1/movies')
                .send(newMovie)
                .end((err, res) => {
                    expect(res.status).to.equal(StatusCodes.CREATED);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.eql(expectedResponse);
                    done();
                });
        });
        it('Should return a detailed errors messages if specified data already exists in db and a status status 422', (done) => {
            const newDuplicatedMovie: AddMovie = {
                title: 'Requiem for a Dream',
                year: 2000,
                runtime: 102,
                genres: ['Drama'],
                director: 'Darren Aronofsky',
                actors: 'Ellen Burstyn, Jared Leto, Jennifer Connelly, Marlon Wayans',
                plot: 'The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.',
                posterUrl:
                    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTkzODMzODYwOF5BMl5BanBnXkFtZTcwODM2NjA2NQ@@._V1_SX300.jpg'
            };

            chai.request(server)
                .post('/v1/movies')
                .send(newDuplicatedMovie)
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.status).to.equals(StatusCodes.UNPROCESSABLE_ENTITY);
                    done();
                });
        });

        it('Should validate the movie data and return a 422 status with detailed error messages when provided with invalid data', (done) => {
            const newInvalidMovie = {
                genres: [],
                title: 'The Matrix',
                year: 'test',
                runtime: 'test',
                director: 'Lilly Wachowski, Lana Wachowski',
                actors: 'Keanu Reeves, Carrie-Anne Moss, Laurence Fishburne, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Belinda McClory',
                plot: 'Computer hacker Neo learns from mysterious rebels that the world he lives in is just an image sent to his brain by robots.',
                posterUrl: 'https://m.media-amazon.com/images/I/51JSM0+hDmL._AC_.jpg'
            };
            const expectedResponse = {
                message: HttpErrorMessages.DTO_VALIDATION_ERRORS_OCCURRED,
                status: StatusCodes.UNPROCESSABLE_ENTITY,
                errorCode: HttpErrorCodes.UNPROCESSABLE_ENTITY,
                details: [
                    {
                        field: 'genres',
                        value: [],
                        messages: ['genres should not be empty']
                    },
                    {
                        field: 'year',
                        value: 'test',
                        messages: ['year must be an integer number']
                    },
                    {
                        field: 'runtime',
                        value: 'test',
                        messages: ['runtime must be an integer number']
                    }
                ]
            };

            chai.request(server)
                .post('/v1/movies')
                .send(newInvalidMovie)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.eql(expectedResponse);
                    expect(res.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    done();
                });
        });
    });
});
