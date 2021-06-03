FROM node:12
WORKDIR /home/node/app
COPY package.json /home/node/app
RUN npm install
COPY . /home/node/app
#Expose port and start application
EXPOSE 8080
CMD ["npm", "start"]



