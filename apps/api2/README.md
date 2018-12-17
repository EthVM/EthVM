<h1>NestJS Boilerplate
  <a
    href="http://nestjs.com/"
    target="blank"
  >
    <img
      src="https://nestjs.com/img/logo_text.svg"
      width="65"
      alt="Nest Logo"
    />
  </a>
</h1>

## Description

[NestJS](https://github.com/nestjs/nest) Boilerplate made with ❤️ by [💡VivifyIdeas💡](https://www.vivifyideas.com).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Configuration

Integrated Configuration Module so you can just inject `ConfigService`
and read all environment variables from `.env` file.
Don't forget to make your own `.env` file!

## Swagger

RESTful APIs you can describe with already integrated Swagger.
To see all available endpoints visit http://localhost:3000/api/docs

## TypeORM integrated

[TypeORM](http://typeorm.io/) gives you possibility to use next db types:
`mysql`, `postgres`, `mariadb`, `sqlite`, etc. Please look at docs for more details.
We have provided working example with `sqlite`, but you have possibility to change
this through `ormconfig.json`. By default you will get `sqlite-example.sql` file
created in the root directory, but it's ignored by git.

## Authentication - JWT

Already preconfigured JWT authentication.
It's suggested to change current password hashing to something more secure.
You can start use already working implementation of `Login` and `Registration`
endpoints, just take a look at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## License

NestJS Boilerplate is [MIT licensed](LICENSE).
