#!/bin/bash -xe

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

apt install bcache-tools

mkfs.ext4 -F /dev/xvdh
mkfs.ext4 -F /dev/nvme0n1

wipefs -a /dev/xvdh
wipefs -a /dev/nvme0n1

make-bcache -B /dev/xvdh
make-bcache -C /dev/nvme0n1

while [ ! -f /sys/fs/bcache/register ]
do
    sleep 2
done

echo /dev/xvdh > /sys/fs/bcache/register || true
echo /dev/nvme0n1 > /sys/fs/bcache/register || true

mkfs.ext4 /dev/bcache0
mkdir -p /mnt/ethereum
mount /dev/bcache0 /mnt/ethereum

echo writeback > /sys/block/bcache0/bcache/cache_mode

echo "/dev/bcache0 /mnt/ethereum  ext4    defaults,nofail" >> /etc/fstab

echo '127.0.0.1 ethclient' | sudo tee -a /etc/hosts
hostnamectl set-hostname "ethclient"
