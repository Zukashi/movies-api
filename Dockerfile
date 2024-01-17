FROM node:21-alpine

WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN mkdir -p /usr/src/app/logs
RUN chown node:node /usr/src/app/logs
RUN npm install
USER node
CMD ["sh", "-c", "npm run dev"]