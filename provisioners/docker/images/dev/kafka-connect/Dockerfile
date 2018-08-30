FROM confluentinc/cp-kafka-connect-base:5.0.0

ENV COMPONENT=kafka-connect
ENV MONGODB_COMPONENT=mongodb

RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:5.0.0
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-elasticsearch:5.0.0
RUN confluent-hub install --no-prompt hpgrahsl/kafka-connect-mongodb:1.1.0

# Copy MongoDB sink properties
COPY mongodb.properties /etc/"${COMPONENT}"/"${MONGODB_COMPONENT}".properties

# Replace configure script
COPY configure /etc/confluent/docker/configure
RUN chmod +x /etc/confluent/docker/configure

# Replace startup script
COPY launch /etc/confluent/docker/launch
RUN chmod +x /etc/confluent/docker/launch
