FROM node:lts-alpine

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

# Fonts
RUN apk add --no-cache ttf-freefont font-opensans ttf-opensans

RUN mkdir /project
WORKDIR /project

# Install dependencies using a cache layer
COPY ./apps/frontend-nextjs/package.json /project/package.json
COPY ./apps/frontend-nextjs/package-lock.json /project/package-lock.json

RUN npm ci

# Copy Next.js application source
COPY ./apps/frontend-nextjs/ /project/

# Build Next.js app
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Runs startup scripts before every run
COPY ./docker-entrypoint.sh /project/docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["doppler", "run", "--", "npm", "start"]

