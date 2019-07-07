# NodeJS API Bootstrap - Typescript, Express, Mongoose, Winston, Jest

### Background
I originally started to build this solely as a Todo API for three different frontend applications (Angular / React / Vue). I decided to convert it to a bootstrap for any API I decide to build in NodeJS.


### Installation

#### With Docker
1. Clone the repo or download the zip file.
```
git clone https://github.com/kcheco/nodejs-typesript-api-bootstrap.git
```
3. Go to project directory.
2. In terminal, run `docker-compose build`.
3. Then, run `docker-compose up`.

#### Without Docker
1. Install [Typescript](https://www.typescriptlang.org/docs/home.html).
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Clone the repo or download the zip file.
```
git clone https://github.com/kcheco/nodejs-typesript-api-bootstrap.git
```
3. Go to project directory.
4. Run `npm install`.
5. Modify configuration files and set up a .env file at your own will.
6. Create your domain layer and write tests for the API requests.


### NPM Scripts
Runs tests. The core classes in the `src/infrastructure` directory have 90+ test coverage.
```
npm run test
```

Runs a production ready application
```
npm run start
```

Builds a production ready application
```
npm run build
```

Runs the production ready application. This will work only if *npm run build* is called before this script.
```
npm run serve
```

Runs the production ready application using Nodemon. This will work only if *npm run build* is called before this script.
```
npm run serve-debug
```

Rebuilds the application using the latest Typescript configuration
```
npm run build-ts
```

Useful for when running application in non-production mode.
```
npm run dev-start
```

Runs Typescript linter
```
npm run tslint
```

### Dependencies
- Express *as the web framework*
- Mongoose *as the database client for MongoDB*
- Winston *as the logging service*
- Jest *as the testing framework*
- Supertest *allows you to test http requests*
- TSLint *as the linter service for Typescript*
- Dotenv *allows you to load environment variables from .env file*

### Todo
- Explain file structure
- Create abstract classes for Controllers & Repositories
- Decouple the Router class
- ~~Dockerize the project~~ :white_check_mark: