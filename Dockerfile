# Build:
# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
MAINTAINER MEAN.JS

# 80 = HTTP, 443 = HTTPS, 3000 = MEAN.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 80 443 3000 35729 8080

# set port for production
ENV PORT 8080
ENV HOST 0.0.0.0

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 curl \
 git \
 ssh \
 gcc \
 make \
 build-essential \
 libkrb5-dev \
 sudo \
 apt-utils \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# install other dependences
RUN sudo npm install -g npm@6.13.4
RUN sudo apt-get install --reinstall libpng16-16=1.6.34-1
RUN sudo apt-get install libpng-dev -y --no-install-recommends

# Install MEAN.JS Prerequisites
RUN sudo npm install
RUN npm install --quiet -g gulp bower yo mocha karma-cli pm2 && npm cache clean --force
RUN mkdir -p /opt/mean.js/public/lib
WORKDIR /opt/mean.js

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/mean.js/package.json
RUN sudo npm install --quiet && npm cache clean --force

# Install bower packages
COPY bower.json /opt/mean.js/bower.json
COPY .bowerrc /opt/mean.js/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

COPY . /opt/mean.js

# delete the local node_moodules and package.json.lock and re-install once more
RUN sudo rm -rf node_modules package-lock.json

# Run MEAN.JS server
CMD sudo npm install && npm start
