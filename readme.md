## The Software House - Node.js Developer recruitment task

Hey there!

Not so long ago we decided create a catalogue of our favourite movies (data/db.json) as json. It is hard to update, so we would like to build an API
for it, however we don't need a database, we still need it as a file.

### TODOS

1. We need to be able to add a new movie. Each movie should contain information about:

- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)

Each field should be properly validated and meaningful error message should be return in case of invalid value.

2. We also need an endpoint that will return an array of movies (it might be a single movie) based on few conditions. The endpoint should take 2 optional query parameters:

- duration
- an array of genres

If we don't provide any parameter, then it should return a single random movie.

If we provide only duration parameter, then it should return a single random movie that has a runtime between <duration - 10> and <duration + 10>.

If we provide only genres parameter, then it should return all movies that contain at least one of the specified genres. Also movies should be ordered by a number of genres that match. For example if we send a request with genres [Comedy, Fantasy, Crime] then the top hits should be movies that have all three of them, then there should be movies that have one of [Comedy, Fantasy], [comedy, crime], [Fantasy, Crime] and then those with Comedy only, Fantasy only and Crime only.

And the last one. If we provide both duration and genres parameter, then we should get the same result as for genres parameter only, but narrowed by a runtime. So we should return only those movies that contain at least one of the specified genres and have a runtime between <duration - 10> and <duration + 10>.

In any of those cases we don't want to have duplicates.

### Rules

**Use express.js**

**Keep code clean**

**The code should be unit tested**

**Remember about proper error handling**

**We require code in git repository**

## Running application


The application can be executed in different environments. For development purposes, it can be either ran locally through NPM + Node.js or Docker.

### Local environment

1. Run `cp .env.example .env`.
2. Run `npm install`.
3. Run `npm run start`.


### Docker

1. Run `cp .env.example .env`.
2. Run `docker-compose up --build -d`.

### Unit tests

1. Run `cp .env.example .env`.
2. Swap `development` in  `.env` to `test`
3. Run `npm install`.
4. Run `npm test`.

### Code style
Project uses Prettier and ESLint in order to make code clean.
In order to reformat/check code run:

1. Run `npm run lint`.
2. Run `npm run prettier-format`.