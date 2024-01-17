import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import { IsPositive, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export default class MoviesQueryParamsDto implements MoviesQueryParams {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(10)
    public duration?: number;

    @IsOptional()
    @IsArray()
    public genres?: string[];
}
