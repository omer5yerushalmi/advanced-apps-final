FROM node:20-slim

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

RUN mkdir -p public && chmod 777 public
# Create SSL directory with proper permissions
RUN mkdir -p /ssl && chmod 755 /ssl

# Copy .env file
COPY .env .env

EXPOSE 4000

CMD ["npm", "start"] 