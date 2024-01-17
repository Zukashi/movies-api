import { expect } from 'chai';
import { DbMovie, Movie } from '@interfaces/movie.interface';
import { MovieTransformer } from '@transformers/movie.transformer';

describe('MovieTransformer', () => {
    describe('transformDbMovieToMovie', () => {
        describe('Correctly transforms a DbMovie object into a Movie object', () => {
            const movieTransformer = new MovieTransformer();
            const testCases = [
                {
                    expectedMovie: {
                        id: 133,
                        title: 'The Lord of the Rings: The Two Towers',
                        year: 2002,
                        runtime: 179,
                        genres: ['Action', 'Adventure', 'Drama'],
                        director: 'Peter Jackson',
                        actors: 'Bruce Allpress, Sean Astin, John Bach, Sala Baker',
                        plot: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
                        posterUrl:
                            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTAyNDU0NjY4NTheQTJeQWpwZ15BbWU2MDk4MTY2Nw@@._V1_SX300.jpg'
                    },
                    dbMovie: {
                        id: 133,
                        title: 'The Lord of the Rings: The Two Towers',
                        year: '2002',
                        runtime: '179',
                        genres: ['Action', 'Adventure', 'Drama'],
                        director: 'Peter Jackson',
                        actors: 'Bruce Allpress, Sean Astin, John Bach, Sala Baker',
                        plot: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
                        posterUrl:
                            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTAyNDU0NjY4NTheQTJeQWpwZ15BbWU2MDk4MTY2Nw@@._V1_SX300.jpg'
                    }
                },
                {
                    dbMovie: {
                        id: 56,
                        title: 'Match Point',
                        year: '2005',
                        runtime: '119',
                        genres: ['Drama', 'Romance', 'Thriller'],
                        director: 'Woody Allen',
                        actors: 'Jonathan Rhys Meyers, Alexander Armstrong, Paul Kaye, Matthew Goode',
                        plot: 'At a turning point in his life, a former tennis pro falls for an actress who happens to be dating his friend and soon-to-be brother-in-law.',
                        posterUrl:
                            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzNzY4MzE5NF5BMl5BanBnXkFtZTcwMzQ1MDMzMQ@@._V1_SX300.jpg'
                    },
                    expectedMovie: {
                        id: 56,
                        title: 'Match Point',
                        year: 2005,
                        runtime: 119,
                        genres: ['Drama', 'Romance', 'Thriller'],
                        director: 'Woody Allen',
                        actors: 'Jonathan Rhys Meyers, Alexander Armstrong, Paul Kaye, Matthew Goode',
                        plot: 'At a turning point in his life, a former tennis pro falls for an actress who happens to be dating his friend and soon-to-be brother-in-law.',
                        posterUrl:
                            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzNzY4MzE5NF5BMl5BanBnXkFtZTcwMzQ1MDMzMQ@@._V1_SX300.jpg'
                    }
                }
            ];
            testCases.forEach(({ dbMovie, expectedMovie }) => {
                it(`Correctly transforms DbMovie with id ${dbMovie.id} into a Movie object`, () => {
                    const mappedMovie = movieTransformer.transformDbMovieToMovie(dbMovie);
                    expect(mappedMovie).to.eql(expectedMovie);
                });
            });
        });
    });

    describe('transformMovieToDbMovie', () => {
        it('Correctly transforms a Movie object into a DbMovie object', () => {
            const movie: Movie = {
                id: 133,
                title: 'The Lord of the Rings: The Two Towers',
                year: 2002,
                runtime: 179,
                genres: ['Action', 'Adventure', 'Drama'],
                director: 'Peter Jackson',
                actors: 'Bruce Allpress, Sean Astin, John Bach, Sala Baker',
                plot: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
                posterUrl:
                    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTAyNDU0NjY4NTheQTJeQWpwZ15BbWU2MDk4MTY2Nw@@._V1_SX300.jpg'
            };
            const dbMovie: DbMovie = {
                id: 133,
                title: 'The Lord of the Rings: The Two Towers',
                year: '2002',
                runtime: '179',
                genres: ['Action', 'Adventure', 'Drama'],
                director: 'Peter Jackson',
                actors: 'Bruce Allpress, Sean Astin, John Bach, Sala Baker',
                plot: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
                posterUrl:
                    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTAyNDU0NjY4NTheQTJeQWpwZ15BbWU2MDk4MTY2Nw@@._V1_SX300.jpg'
            };
            const movieTransformer: MovieTransformer = new MovieTransformer();
            const mappedDbMovie: DbMovie = movieTransformer.transformMovieToDbMovie(movie);
            expect(mappedDbMovie).to.eql(dbMovie);
        });
    });
});
