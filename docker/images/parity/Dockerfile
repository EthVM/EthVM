FROM ethvm/parity:stable-ethvm

USER root

COPY ./entrypoint.sh /home/parity/entrypoint.sh

RUN chown parity /home/parity/entrypoint.sh && \
    chmod +x /home/parity/entrypoint.sh

USER parity

ENTRYPOINT [ "/home/parity/entrypoint.sh" ]
