# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Rebuild bcrypt module
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the port your backend server will run on
EXPOSE 3001

# Command to run your backend server
CMD ["npm", "start"]
