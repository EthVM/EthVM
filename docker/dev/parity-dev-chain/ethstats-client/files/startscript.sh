#!/bin/sh

cd /root/eth-net-intelligence-api/
/usr/bin/pm2 start app.json
/usr/bin/pm2 logs
