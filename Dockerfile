# syntax=docker/dockerfile:1

FROM node:14.19.1
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]