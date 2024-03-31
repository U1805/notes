---
title: Server Clash
published: 2024-02-17 18:46:18
draft: false
tags: [server clash, proxy]
category: Examples
image: "./aru.jpg"
---

在研究 QQ 机器人搭建的时候，一个推文推送的功能需要访问外网。正好前些日子看到 [Warp-Clash-Api](https://github.com/vvbbnn00/WARP-Clash-API) 的仓库，顺便试试

思路是这样的：Warp 是良心老大哥 Cloudfare 推出的免费 VPN 服务，warp-clash-api 可以通过订阅的方式使用 warp。QQbot 的功能需要外网访问，因此需要搭建 clash 服务，clash 服务需要订阅节点，因此先搭建 warp-clash-api 获取节点。

## WARP-CLASH-API 搭建

git clone 项目，在目录里新建文件 `.env.local` 写入密钥 `SECRET_KEY=your_secret_key`，docker compose 启动即可  
```bash
git clone https://github.com/vvbbnn00/WARP-Clash-API.git
docker-compose up -d
```

> 改一下 restart: always，这样开机的时候就能自己启动了

验证一下 `curl http://127.0.0.1:21001/` 有结果

这时候访问 http://127.0.0.1:21001/ 会有订阅界面，获取订阅链接  
http://127.0.0.1:21001/api/clash?best=true&randomName=true&key=srcret_key

## Clash 搭建

先下一份节点文件  
```bash
wget "http://127.0.0.1:21001/api/clash?best=true&randomName=true&key=srcret_key" -O clash.yaml
```

clash 直接使用 docker 搭建  
```bash
docker run -d --name=clash -v "~/clash.yaml:/root/.config/clash/config.yaml" -p "7890:7890" -p "7891:7891" -p "9090:9090" --restart=unless-stopped dreamacro/clash-premium
```

其中 `~/clash.yaml` 是节点文件的路径，`7890` 是客户端端口（建议还是改一下）

启动之后验证一下 `curl --proxy http://127.0.0.1:7890 https://www.youtube.com`

## 定时更新

添加 cron 定时任务就可以实现

更新脚本 reload-clash.sh：  
```bash
wget -O ~/clash/clash.yaml "http://127.0.0.1:21001/api/clash?best=true&randomName=true&key=srcret_key"

docker container restart clash
```

定时任务：  
```bash
crontab -e
00,30 * * * * sh ~/clash/reload-clash.sh # 每小时更新运行两次
```

## 系统代理

在环境变量中添加  
```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export no_proxy=localhost,127.0.0.1
```

为了 docker 容器内可以访问代理，在 .docker/config 里添加
```bash
{
    "proxies":
    {
        "default":
        {
            "httpProxy": "http://127.0.0.1:7890",
            "httpsProxy": "http://127.0.0.1:7890",
            "noProxy": "localhost,127.0.0.1"
        }
    }
}
```

## 待解决

照理来说 docker 中应该能正常通过代理访问，但是我运行容器时发现并没有走代理

目前的解决办法是 docker 容器的网络模式使用 host，与主机公用 ip，缺点是没有了网络隔离和端口映射

```bash
docker run ... --network host ...
```