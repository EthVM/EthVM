FROM mongo:4.0

ENV MONGODB_URL=mongodb://mongodb:27017/ethvm-mainnet

COPY retry.sh /usr/bin/retry.sh
RUN chmod +x /usr/bin/retry.sh

COPY mongodb-ethvm-init.sh /usr/bin/mongodb-ethvm-init.sh
RUN chmod +x /usr/bin/mongodb-ethvm-init.sh

COPY mongodb-init.js /mongodb-init.js

CMD ["mongodb-ethvm-init.sh"]
