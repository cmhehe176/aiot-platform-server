FROM node:20.17.0-alpine AS base

WORKDIR /app

RUN set -eux; \
	apk add --update --no-cache git build-base; \
	corepack enable

COPY --chown=node:node package.json yarn.lock ./

RUN yarn global add @nestjs/cli

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM base as production

WORKDIR /app

COPY --from=base /app/dist app/dist
COPY --from=base /app/package.json app/package.json
COPY --from=base /app/yarn.lock app/yarn.lock

RUN yarn install --frozen-lockfile --prod

CMD [ "node", "dist/main.js" ]


