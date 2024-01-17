import { MovieRepository } from '@repos/movie.repository';
import { registerDecorator, ValidationOptions } from 'class-validator';
import Container from 'typedi';

export function IsGenreCorrect(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'IsGenreCorrect',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                async validate(value: string) {
                    const movieRepository: MovieRepository = Container.get(MovieRepository);
                    const genres: string[] = await movieRepository.findAllGenres();
                    return genres.includes(value);
                }
            }
        });
    };
}
