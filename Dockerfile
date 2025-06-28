FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN yarn install
RUN yarn build

COPY . .

EXPOSE 5173
CMD ["yarn", "dev"]
