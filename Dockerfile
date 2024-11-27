# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

RUN npm install -g serve

RUN serve -s build -p 3001

EXPOSE 3001