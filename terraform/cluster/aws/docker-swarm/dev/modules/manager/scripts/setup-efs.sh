apt install nfs-common -y
apt install cachefilesd -y
mkdir -p /mnt/efs
mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,fsc ${efs_mount_target_dns}:/ /mnt/efs
echo "RUN=yes" >> /etc/default/cachefilesd
service cachefilesd restart
echo "${efs_mount_target_dns}:/ /mnt/efs nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,fsc,_netdev 0 0" >> /etc/fstab