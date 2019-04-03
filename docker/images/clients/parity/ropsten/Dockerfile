#Get base image
FROM ubuntu:16.04

# Set environment variables.
ENV HOME /root

#Run some commands
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    supervisor

RUN wget https://raw.githubusercontent.com/paritytech/scripts/master/get-parity.sh && \
    bash get-parity.sh -r stable

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get update &&\
    apt-get install -y nodejs

RUN cd /root/ && \
    git clone --depth=1 https://github.com/cubedro/eth-net-intelligence-api.git && \
    cd eth-net-intelligence-api 												&& \
    npm install 																&& \
    npm install -g pm2

ADD files/app.json /root/eth-net-intelligence-api/app.json
ADD files/ethstats.sh /root/ethstats.sh
ADD files/parity.supervisor.conf /etc/supervisord.conf

RUN chmod +x /root/ethstats.sh

#expose the ports
EXPOSE 9001
EXPOSE 8545
EXPOSE 8546
EXPOSE 30303
EXPOSE 30303/udp

ENTRYPOINT ["supervisord", "--nodaemon"]
