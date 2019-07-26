FROM nginx:1.17.2-alpine

ENV DOCKERIZE_VERSION v0.6.1

ENV EXPLORER_DOMAIN ethvm.lan
ENV EXPLORER_UPSTREAM explorer:8080

ENV API_DOMAIN api.ethvm.lan
ENV API_UPSTREAM api:3000

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY nginx.tpl.conf /etc/nginx/nginx.tpl.conf

EXPOSE 80

ENTRYPOINT [ "dockerize", "-template", "/etc/nginx/nginx.tpl.conf:/etc/nginx/nginx.conf" ]
CMD ["nginx", "-g", "daemon off;"]
