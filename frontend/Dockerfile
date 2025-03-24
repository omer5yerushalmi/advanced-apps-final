FROM node:20-alpine

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

# Add environment variables for build time
ARG VITE_API_URL
ENV VITE_API_URL="https://node69.cs.colman.ac.il:4000"

RUN npm run build

# Install serve globally
RUN npm install -g serve

EXPOSE 443

CMD ["serve", "-s", "build", "--ssl-cert", "/ssl/cert.pem", "--ssl-key", "/ssl/key.pem", "--listen", "443"]
