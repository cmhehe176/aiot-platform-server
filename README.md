## Description

AIot Platform Server

## Setup Database and Project

If you are familiar with using PostgreSQL on desktop and it's running stably, you can skip this step.
Otherwise, follow my instructions so you can run it with Docker.
( you must fullfilled file .env to connect this service )

```bash
# you must be check this command for test Docker health is still good
$ docker ps

# you must fullfilled in this file .env to access server and database
$ cp .env.example .env

# use this command for build or rebuild this images
$ docker compose up -d --build

# sync database and create seed
$ yarn sync

# only use this command for first time run images , use command below this command to pull lib and migration database to server
$ docker exec -it server sh -c "yarn && yarn migration && yarn seed && exit"

# if your code is change or lib change , you need to rebuild this images by use this command
$ docker exec -it server sh -c "yarn && yarn migration && exit"

```

## Setup Zabbix to connect device with database

You have to be in the directory containing the Docker Compose file ( compose.yaml ) in order to use it (folder: iot_platform_server).

```bash

# you must fullfilled .env to connect this service
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
