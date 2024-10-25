FROM node:20.17.0-alpine

WORKDIR /iot-server

RUN set -eux; \
	apk add --update --no-cache git build-base; \
	corepack enable

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install

COPY . .

COPY .env.example .env

CMD ["yarn", "dev", "--", "--host"]