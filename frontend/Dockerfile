# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to build your application
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Command to serve the built application
CMD ["serve", "-s", "dist", "-p", "3000"]
