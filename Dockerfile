# base image
FROM node:10.7.0

# update image package list and upgrade
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN set -x \
    && apt-get update

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# set environment variables
ENV NODE_ENV developmemt

# install and cache dependencies
COPY package*.json /usr/src/app/
RUN npm install

# add app to working directory
COPY . /usr/src/app

# start app
CMD npm run dev-start