FROM mvertes/alpine-mongo:4.0.5-0

RUN apk add --no-cache mongodb-tools

CMD ["mongod", "--bind_ip", "0.0.0.0", "--replSet", "rs0", "--quiet", "--slowms", "10000"]
