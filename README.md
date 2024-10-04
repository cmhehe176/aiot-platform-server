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

## Setup Zabbix to connect device with database

You have to be in the directory containing the Docker Compose file ( compose.yaml ) in order to use it (folder: iot_platform_server).

```bash

$ docker ps
# you must be check this command for test Docker is still running

$ docker compose up -d --build

# access zabbix in http://127.0.0.1:8081 ( zabbix web , server run in host: 10051)
# (error when first access , please wait 30s) (username: Admin , password : zabbix )

# if you want to access database for control zabbix , try http://127.0.0.1:8080 (adminer)
# PostgreSQL
# host : database
# username: 1234
# password: 1234
# database: zabbix_db


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
