FROM node:22 AS build

WORKDIR /usr/src/app

# Copy only files to install dependencies
COPY package.json yarn.lock tsconfig.json .

# Copy ORM files
COPY prisma ./prisma

# Installing dependencies
RUN yarn install

# Generating prisma client
RUN yarn generate:client

# Copy the remaining code
COPY src ./src

# Building application
RUN yarn build

# Installing only the production dependencies
RUN yarn install --group="dependencies"

# Making Directories
RUN mkdir build
RUN mkdir build/src

# Moving build content to correct folders
RUN mv dist/* ./build/src 
RUN mv node_modules prisma package.json yarn.lock ./build

FROM node:22-alpine

WORKDIR /usr/src/app

# Copy code from the build step
COPY --from=build /usr/src/app/build .

# Starting application
ENTRYPOINT ["npm", "run", "start"] 

