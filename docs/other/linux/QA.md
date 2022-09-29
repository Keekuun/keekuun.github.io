# 1.Cannot connect to the Docker daemon ...
```bash
$ docker ps -a
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```
执行命令,发现任然不OK：
```bash
$ systemctl start docker
System has not been booted with systemd as init system (PID 1). Can't operate.
```

手动启动：
```bash
$ systemctl start docker
System has not been booted with systemd as init system (PID 1). Can't operate.
```

继续try
```bash
# 成功！
$ sudo dockerd
INFO[2022-08-23T15:49:48.291644300+08:00] Starting up
```
> [Cannot Connect to a Docker Daemon](https://www.baeldung.com/ops/docker-cannot-connect#2-start-the-docker-daemon-manually)
