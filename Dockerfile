FROM node:14-alpine
RUN apk update && apk add bash curl  && \
    mkdir -p /home/crawler && chown -R node:node /home/crawler && \
    mkdir -p /home/crawler/logs && chown -R node:node /home/crawler/logs && \
    npm install pm2 -g && npm install next -g 
WORKDIR /home/crawler
USER node
COPY --chown=node:node . .
EXPOSE 3000
RUN chmod +x ./startup.sh && npm install && npm run build

CMD ["/bin/bash", "-c", "./startup.sh"]