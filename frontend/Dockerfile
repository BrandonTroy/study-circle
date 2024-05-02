# Use the latest node as a base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm install

# Copy the rest of the application's code into the image
COPY . .

# Expose port 80 for the application
EXPOSE 80

# Define the command to run the application
CMD ["npm", "run", "dev"]