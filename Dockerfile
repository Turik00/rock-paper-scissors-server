# Create image based on the official Node 10 image from dockerhub
FROM node:latest

# Create a directory where our app will be placed
RUN mkdir -p /server

# Change directory so that our commands run inside this new directory
WORKDIR /server

# Copy dependency definitions
COPY package*.json /server/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /server/

# Expose the port the app runs in
EXPOSE 5000

# Serve the app
CMD ["npm", "start"]