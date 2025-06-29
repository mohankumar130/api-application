# Use Node.js base image
FROM node:20

# Set app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "start"]
