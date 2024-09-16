FROM node:20-alpine

WORKDIR /usr/server

COPY ./package.json ./
RUN npm install

COPY ./ .

RUN npm run build
ENV NODE_ENV=production
ENV MINIO_ACCESS_KEY=root
ENV MINIO_SECRET_ACCESS_KEY=password
ENV MINIO_ENDPOINT=http://minio:9000

CMD ["npm", "run", "start"]