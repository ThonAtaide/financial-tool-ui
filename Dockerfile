FROM node:16-alpine 

ENV NODE_ENV production
ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=${BACKEND_URL}
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]