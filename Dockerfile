FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

EXPOSE 5173

ENV VITE_PORT=5173
ENV VITE_HOST=0.0.0.0

CMD ["npm", "run", "dev"]
