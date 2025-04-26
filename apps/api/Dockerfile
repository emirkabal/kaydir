FROM node:lts-alpine 
 
WORKDIR /usr/src/app
 
COPY . .
 
RUN npm install
RUN npm build
 
 
EXPOSE 3001
 
CMD [ "npm", "run", "start" ]