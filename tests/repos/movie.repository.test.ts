import { expect } from 'chai';
import { DbMovie } from '@interfaces/movie.interface';
import { MovieRepository } from '@repos/movie.repository';
import sinon from 'sinon';
import { join } from 'path';
import fs from 'fs';
import JsonDatabase from '@interfaces/json-database.interface';

describe('MovieRepository', () => {
    describe('findAllMovies', () => {
        it('Should return array of all movies', async () => {
            const movieRepository: MovieRepository = new MovieRepository();
            const dbMovies: DbMovie[] = await movieRepository.findAllMovies();
            expect(dbMovies).to.be.an('array').length(147);

            for (const dbMovie of dbMovies) {
                expect(dbMovie).to.have.keys([
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
        });
        it('Should return array of all movies without duplicates and with correct data types', async () => {
            const movieRepository: MovieRepository = new MovieRepository();
            const dbMovies: DbMovie[] = await movieRepository.findAllMovies();

            const uniqueIds = new Set();
            dbMovies.forEach((dbMovie) => {
                expect(uniqueIds.has(dbMovie.id)).to.be.false;
                uniqueIds.add(dbMovie.id);

                expect(dbMovie.id).to.be.a('number');
                expect(dbMovie.title).to.be.a('string');
                expect(dbMovie.year).to.be.a('string');
                expect(dbMovie.runtime).to.be.a('string');
                expect(dbMovie.genres).to.be.an('array');
                dbMovie.genres.forEach((genre) => {
                    expect(genre).to.be.a('string');
                });
                if (dbMovie.actors !== undefined) {
                    expect(dbMovie.actors).to.be.a('string');
                } else {
                    expect(dbMovie.actors).to.be.undefined;
                }
                expect(dbMovie.director).to.be.a('string');
                if (dbMovie.posterUrl !== undefined) {
                    expect(dbMovie.posterUrl).to.be.a('string');
                } else {
                    expect(dbMovie.posterUrl).to.be.undefined;
                }
                if (dbMovie.plot !== undefined) {
                    expect(dbMovie.plot).to.be.a('string');
                } else {
                    expect(dbMovie.plot).to.be.undefined;
                }
            });

            expect(dbMovies).to.be.an('array').length(147);
        });

        it('Should return an empty array when there are no movies in the database', async () => {
            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'findAllMovies').resolves([]);
            const dbMovies: DbMovie[] = await movieRepository.findAllMovies();

            expect(dbMovies).to.be.an('array').that.is.empty;

            sinon.restore();
        });
    });

    describe('findAllMoviesMatchingGenres', () => {
        it('Should return an array of movies which are sorted by a number of matching genres', async () => {
            const genres: string[] = ['Drama', 'Adventure', 'Sci-Fi'];
            const expectedDbMovies: DbMovie[] = [
                {
                    id: 98,
                    title: 'Cloud Atlas',
                    year: '2012',
                    runtime: '172',
                    genres: ['Drama', 'Sci-Fi'],
                    director: 'Tom Tykwer, Lana Wachowski, Lilly Wachowski',
                    actors: 'Tom Hanks, Halle Berry, Jim Broadbent, Hugo Weaving',
                    plot: 'An exploration of how the actions of individual lives impact one another in the past, present and future, as one soul is shaped from a killer into a hero, and an act of kindness ripples across centuries to inspire a revolution.',
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTczMTgxMjc4NF5BMl5BanBnXkFtZTcwNjM5MTA2OA@@._V1_SX300.jpg'
                },
                {
                    id: 116,
                    title: 'Interstellar',
                    year: '2014',
                    runtime: '169',
                    genres: ['Adventure', 'Drama', 'Sci-Fi'],
                    director: 'Christopher Nolan',
                    actors: 'Ellen Burstyn, Matthew McConaughey, Mackenzie Foy, John Lithgow',
                    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_SX300.jpg'
                },
                {
                    id: 91,
                    title: 'Gattaca',
                    year: '1997',
                    runtime: '106',
                    genres: ['Drama', 'Sci-Fi', 'Thriller'],
                    director: 'Andrew Niccol',
                    actors: 'Ethan Hawke, Uma Thurman, Gore Vidal, Xander Berkeley',
                    plot: 'A genetically inferior man assumes the identity of a superior one in order to pursue his lifelong dream of space travel.',
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BNDQxOTc0MzMtZmRlOS00OWQ5LWI2ZDctOTAwNmMwOTYxYzlhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
                }
            ];
            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(expectedDbMovies);
            const dbMovies: DbMovie[] = await movieRepository.findAllMoviesMatchingGenres(genres);

            expect(dbMovies).to.eql(expectedDbMovies);

            sinon.restore();
        });
    });

    describe('findAllMoviesMatchingGenresAndNarrowedByRuntime', () => {
        it('Should return an array of movies which are sorted by a number of matching genres and narrowed by runtime', async () => {
            const genres: string[] = ['Animation', 'Adventure', 'Comedy'];
            const duration = 134;
            const expectedDbMovies: DbMovie[] = [
                {
                    id: 146,
                    title: 'The Big Short',
                    year: '2015',
                    runtime: '130',
                    genres: ['Biography', 'Comedy', 'Drama'],
                    director: 'Adam McKay',
                    actors: 'Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert',
                    plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg'
                },
                {
                    id: 41,
                    title: 'Moneyball',
                    year: '2011',
                    runtime: '133',
                    genres: ['Biography', 'Drama', 'Sport'],
                    director: 'Bennett Miller',
                    actors: 'Brad Pitt, Jonah Hill, Philip Seymour Hoffman, Robin Wright',
                    plot: "Oakland A's general manager Billy Beane's successful attempt to assemble a baseball team on a lean budget by employing computer-generated analysis to acquire new players.",
                    posterUrl:
                        'https://images-na.ssl-images-amazon.com/images/M/MV5BMjAxOTU3Mzc1M15BMl5BanBnXkFtZTcwMzk1ODUzNg@@._V1_SX300.jpg'
                }
            ];
            const movieRepository: MovieRepository = new MovieRepository();

            sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(expectedDbMovies);
            const dbMovies: DbMovie[] = await movieRepository.findAllMoviesMatchingGenresAndNarrowedByRuntime(
                duration,
                genres
            );

            expect(dbMovies).to.eql(expectedDbMovies);

            sinon.restore();
        });
    });

    describe('saveMovie', () => {
        after(async () => {
            const dbTestPath: string = join(process.cwd(), process.env.TEST_DB_PATH as string);
            const fileContents = await fs.promises.readFile(dbTestPath);
            const jsonTestDb: JsonDatabase = await JSON.parse(fileContents.toString());
            jsonTestDb.movies.pop();
            const jsonUpdatedDb: string = JSON.stringify(jsonTestDb, null, 3);
            await fs.promises.writeFile(dbTestPath, jsonUpdatedDb);
        });

        it('Should save new movie in db.test.json', async () => {
            const movieRepository: MovieRepository = new MovieRepository();
            const newFilmEntry: DbMovie = {
                id: 147,
                title: 'The Matrix',
                year: '1999',
                runtime: '136',
                genres: ['Action', 'Sci-Fi'],
                director: 'Lilly Wachowski, Lana Wachowski',
                actors: 'Keanu Reeves, Carrie-Anne Moss, Laurence Fishburne, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Belinda McClory',
                plot: 'Computer hacker Neo learns from mysterious rebels that the world he lives in is just an image sent to his brain by robots.',
                posterUrl: 'https://m.media-amazon.com/images/I/51JSM0+hDmL._AC_.jpg'
            };

            await movieRepository.saveMovie(newFilmEntry);
            const dbAllMovies: DbMovie[] = await movieRepository.findAllMovies();

            expect(dbAllMovies[dbAllMovies.length - 1]).to.eql(newFilmEntry);
        });
    });
});
