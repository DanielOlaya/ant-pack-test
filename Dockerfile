FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
