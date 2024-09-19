## Description

Iot Platform Server

## Setup Database

  If you are familiar with using PostgreSQL on desktop and it's running stably, you can skip this step.
  Otherwise, follow my instructions so you can run it with Docker.

```bash
$ yarn 

$ docker ps 
# you must be check this command for test Docker health is still good

$ cp .env.example .env

$ docker compose up -d --build


```

## Installation

```bash
$ yarn 

# you must create database(name) to connect this app to databse ex like iot_platform

$ yarn migration
# sync your entity to your database

$ yarn seed
# create seed data (roles , users) in db

# access database in localhost:8080 
# username and password in file env 

```

## Running the app

```bash
# development
$ yarn start

# watch mode in development
$ yarn dev

# you can check in localhost:3000 to print Hello World ??

# production mode
$ yarn prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
