FROM node:20.11.1-alphine3.19

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./package.son .
COPY ./node_modules ./node_modules

CMD ["node","dist/index.js"]