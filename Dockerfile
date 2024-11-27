FROM node:20.10.0-slim AS base

COPY . ./app

WORKDIR /app

ENV PORT=3000

FROM base AS prod-deps
RUN yarn install --prod

FROM base AS build
RUN yarn install
RUN yarn build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 8080

CMD [ "pnpm", "start" ]