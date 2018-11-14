FROM confluentinc/cp-kafka-connect:5.0.0

# Install connectors
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:5.0.0
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-elasticsearch:5.0.0
RUN confluent-hub install --no-prompt hpgrahsl/kafka-connect-mongodb:1.1.0
