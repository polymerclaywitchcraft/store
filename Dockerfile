FROM node:lts-alpine

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

# node-canvas dependencies
RUN apk add python3 \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    build-base

# Fonts
RUN apk add --no-cache ttf-freefont font-opensans ttf-opensans
   
RUN mkdir /project

# Copy deps
WORKDIR /project

# Install dependencies to create a cache layer
COPY ./package.json /project
COPY ./package-lock.json /project

# Copy configs
COPY ./nx.json /project
COPY ./tsconfig.base.json /project
# This files is not used in the project, but it is necessary to build the project
COPY ./eslint.config.mjs /project
COPY ./.eslintignore /project
COPY ./jest.config.ts /project
COPY ./jest.preset.js /project

# Copy config files for client and server build
COPY .env /project/

# Runs building processes of the server and the client
COPY ./apps/ /project/apps
# COPY ./libs/ /project/libs

# Install dependencies
RUN \
  npm pkg delete scripts.prepare \
  && npm ci

  
# Build the server
ENV NX_DAEMON=false 
RUN npm run nx:build

ENV HOST=0.0.0.0

# Runs database migrations before every run
COPY ./docker-entrypoint.sh /project/docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["doppler", "run", "--", "npm", "start"]
