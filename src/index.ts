import 'reflect-metadata';
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '@common': `${__dirname}/common`,
    '@interfaces': `${__dirname}/interfaces`,
    '@dtos': `${__dirname}/dtos`,
    '@validators': `${__dirname}/validators`,
    '@middlewares': `${__dirname}/middlewares`,
    '@controllers': `${__dirname}/controllers`,
    '@services': `${__dirname}/services`,
    '@repos': `${__dirname}/repos`,
    '@transformers': `${__dirname}/transformers`,
    '@helpers': `${__dirname}/helpers`,
    '@errors': `${__dirname}/errors`
});
import { Server } from 'http';
import { App } from './app';

const app = new App();
app.start();
export const server: Server = app.getServer();
