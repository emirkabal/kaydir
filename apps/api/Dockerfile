FROM node:lts-alpine 
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the api package.json
COPY apps/api/package.json ./apps/api/package.json
 
RUN npm install
RUN npm build
 
# Copy app source
COPY . .
 
EXPOSE 3001
 
CMD [ "npm", "run", "start" ]