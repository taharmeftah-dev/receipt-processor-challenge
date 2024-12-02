# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
