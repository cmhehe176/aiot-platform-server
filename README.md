## Description

Iot Platform Server

## Setup Database

  If you are familiar with using PostgreSQL on desktop and it's running stably, you can skip this step.
  Otherwise, follow my instructions so you can run it with Docker.

```bash
$ docker ps 
# you must be check this command for test Docker health is still good

$ cp .env.example .env

$ docker compose up -d --build

# after that , 3 container will running , your app is running , check this response in
# localhost:3000
```

## Installation

```bash
$ yarn 

# you must create database(name) to connect this app to databse ex like iot_platform

$ yarn migration
# sync your entity to your database

$ yarn seed
# create seed data (roles , users) in db

# after that you can check api POST MAN
# method Post : 
#{
#    "username": "admin@gmail.com",
#    "password":"12345678"
#}
```

## Running the app

```bash
# development
$ yarn run start

# watch mode in development
$ yarn run dev

# production mode
$ yarn run prod
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
