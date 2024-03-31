---
title: Docker 常用命令
published: 2023-07-13 13:06:21
draft: false
tags: [Docker]
category: Cli-tools
---

学习过程应该先是怎么用，然后是为什么这么用，所以 Docker 原理之后再写（

## 安装

[Docker 安装](https://docs.docker.com/engine/install/)  
[Docker Compose 安装](https://docs.docker.com/compose/install/)

进官网选对应的平台跟着做就行，以 Ubuntu 为例：

1. 卸载旧版
    ```bash
    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
    ```  
2. Docker 官方 GPG key
   ```bash
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    ```
3. 安装
   ```bash
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

WSL2 中安装 docker 也可以看这篇文章：[wsl2安装Linux原生Docker](https://zhuanlan.zhihu.com/p/421998834)

启动 docker 时 `service docker start`，这时如果报错 Failed to start docker.service: Interactive authentication required. 可能是已经开启过了，重启一下即可 `service docker restart`

## 镜像命令

- 查看镜像 `docker images`
- 搜索镜像 `docker search imageName`
- 下载镜像 `docker pull xxx`
- 删除镜像 `docker rmi imageName`
- 更新镜像内容：
  在镜像容器内操作完后，主机上 `docker commit -m=“xxx” -a="xxx" containerId newImageName` -a是作者  
- 构建镜像 `docker build -t ImageName path` path 是 Dockerfile 所在目录

## 容器命令

- 启动容器
```bash
docker run -itd ubuntu:15.10 /bin/bash
-i 允许标准输入
-t 指定一个终端
-d 后台模式，返回容器 id
-P 容器内用的端口随机映射到主机
-p 外端口:内端口 指定映射（外端口可以填ip）默认tcp端口，端口/udp udp端口

docker exec -it 243c32535da7 /bin/bash
exit
```

- 查看容器 `docker ps -a`
- 查看容器标准输出 `docker logs id`
- 停止容器 `docker stop id`
- 重启容器 `docker restart id`
- 删除容器 `docker rm -f id`
	- 删除所有终止的容器 `docker container prune`
- 查看容器端口映射 `docker port id`
- 查看容器内进程 `docker top id`


进阶一点的用法像 Dockerfile、Compose 这些之后用到再记