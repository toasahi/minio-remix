# base node image
FROM node:21-bullseye-slim AS base
ENV NODE_ENV=production

FROM base AS deps
WORKDIR /app
ADD package.json .npmrc ./
RUN npm install --include=dev

FROM base AS production-deps
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN npm run build

FROM base
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .
EXPOSE 5173

CMD ["npm", "start"]