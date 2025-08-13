FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json tailwind.config.js postcss.config.js ./
COPY src ./src
EXPOSE 3000
CMD ["npm", "run", "dev"]
