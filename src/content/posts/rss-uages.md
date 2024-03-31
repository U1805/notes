---
title: 我的RSS使用手册
published: 2022-09-25 2:30:13
tags: [RSS]
category: RSS
draft: false
---

> RSS，一个每天刷着抖音的你可能并不知道的词，一个来自上世纪的产物，一个曾经风光无限如今却快被多数人遗忘的东西...
> 
> 无数人想给它盖上棺材，却也无数人为它而掘墓

## 什么时候需要 RSS

RSS 的核心：资讯聚合 + 拒绝推荐算法

RSS 可以将我们感兴趣的订阅内容聚合，方便阅读，但是过多的资讯只会适得其反，无端消耗精力

所以一般订阅一些**有价值而且更新频率低的源**，比如优质独立站点/博客/特别关注的人或事件 📬

### 订阅源的筛选

信息来源主要可以分为「网页文章」和「新闻资讯」，「新闻资讯」可以细分为「普通新闻」和「行业新闻」。普通新闻多而杂，往往看看标题就可以，不看也行，真正的大新闻最终一定会以各种形式传到你的耳边，所以不用特别订阅

- 网页文章 -> RSS
- 新闻资讯
    - 行业新闻 -> RSS
    - 普通新闻 -> [今日热榜](https://tophub.today/)

### 我的使用场景

- 博客周报：阮一峰的网络日志
- 个人站点：万事屋的阿虚
- 追番追剧：Mikan Project 、FSD炸鸽社的微博
- Bilibili 和 Twitter 特别关注的账号
- 。。。

## 一款合适的 RSS 阅读器

我使用的是「irreader v1.5.9」

> irreader
>
> 订阅网页、RSS和Podcast，具备急速的阅读体验， 高品质、免费、无广告、多平台的阅读器。 泛用型Podcast播放器。 将内容推送到飞书、钉钉、企业微信、Discord、Telegram。

[irreader](http://irreader.fatecore.com/) 的 RSS 是以 Windows 通知的形式出现在右下角，有效避免错过消息

虽然它本身没有强调是 RSS 阅读器，但就体验来说已经足够了。

而且对于一些 RSS 没办法订阅的资讯，irreader 可以通过**订阅网页**的方式自定义添加订阅内容，比如「巴哈姆特」上的帖子更新。

（我使用的是 1.5.9 的老版本，因为后面版本收费限制**订阅个数**了，这个版本也够用就没更新 🤡）

## 寻找 RSS 源

### ① 直接使用公共源

[RSS Source | RSS订阅源推荐 (rss-source.com)](https://rss-source.com/)

或者到网站上找找，一般像博客之类的网站会有 RSS 订阅连接

### ② RSSHUB

```
https://rsshub.app/bilibili/user/video/35579947?filter=编程|摄影&filterout=游戏
------------------ ---------------------------- -----------------------------
   域名               域名                          参数(对标题和描述的过滤)
```

RSSHub 是一个用来制作 RSS 订阅源的工具。与 Huginn、Feed43 等工具类似，RSSHub 在大部分网站上也是通过抓取网页的方式获得订阅源，不同的是在 RSSHub 中，已经完成了对抓取规则的编写，只需要用户简单的编辑下地址即可。

项目文档： [介绍 | RSSHub](https://docs.rsshub.app/)

比如 Pixiv 排行榜，文档里写的很清楚![rsshub](https://dataphoto.sibnet.ru/upload/imggreat/1681868927371480540.jpg)

这个方法唯一的问题就是：官方提供的 RSSHub 域名（[rsshub.app](https://rsshub.app/755/user/akimoto-manatsu)）被墙了 😢

## RSSHUB 域名问题怎么办

### 使用别人的域名（最推荐🌟）

被墙了其实问题不大，<del>找个梯子不就行了</del> 其实还是不推荐直接用官方域名的（RSSHub 官方域名已经被不少网站做了*反爬限制*）

不过可以<font color=orange>找别人的自建站点</font><small>(搜索「Welcome to RSSHub!」)</small> 😎

### 自建服务 Vercel

 因为<font color=orange>自建成本不高</font>，而且不太想增加别人的负担，我通常是自己搭一个 :+1: ，步骤如下：

1. 注册 Github，fork DIYgod/RSSHUB 项目
2. 打开 [Vercel](https://vercel.com/)，登录 Github，Add New Project，选择 RSSHUB Repository 进行部署

部署完其实就有一个域名了，但不幸的是，从8月末开始，vercel 的域名似乎被 [DNS 污染](https://www.itdog.cn/ping/vercel.app)了（处于被墙的状态，无法访问）。所以还需要去配置一个可以访问的域名

### 本地搭建 WSL + Docker

> 如果只是为了 RSSHUB 这一个服务而一直开启 WSL 和 Docker，占用的内存资源其实太多了，不推荐

自建服务固然不错，但是使用 RSSHUB 的时候会发现，<font color=orange>有些路由需要搭配 Cookie 才能访问</font>，而 Vercel + Freenom 的方式是把项目完全托管到 Github 上，配置 Cookie 相当于把账号密码直接给路过的人看

解决这个问题，要么选择个人服务器上部署，亦或者是选择在本地部署

#### 用 Docker Composer 部署 RSSHUB

```bash
# 下载 docker-compose.yml
wget https://raw.githubusercontent.com/DIYgod/RSSHub/master/docker-compose.yml
# 检查有无需要修改的配置
vi docker-compose.yml  # 也可以是你喜欢的编辑器
# 创建 volume 持久化 Redis 缓存
docker volume create redis-data
# 启动
docker-compose up -d
```

这样，就可以使用 http://127.0.0.1:1200/ 作为域名了

#### 设置 Cookie

这里以 Bilibili 的 [用户关注动态](https://docs.rsshub.app/social-media.html#bilibili-yong-hu-guan-zhu-dong-tai) 为例，其他的官方文档也有写 [部署 | RSSHub](https://docs.rsshub.app/install/#pei-zhi-bu-fen-rss-mo-kuai-pei-zhi)

需要添加的字段是`environment` 下的 `BILIBILI_COOKIE_uid: "cookie"`，uid 自己去空间找，cookie 通过 [链接](https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=0&type=8) 控制台查看

```bash
# 修改配置
vi docker-compose.yml  # 也可以是你喜欢的编辑器
# docker 关闭
docker-compose down
# docker 重启
docker volume create redis-data
docker-compose up -d
```

## 结束语

RSS还有很多玩法：搭配BT下载器实现自动下载番剧、搭配学术文献管理软件、搭配Kindle进行阅读、给 RSSHub 源加上过滤规则...

用阿虚的话结尾

> 而 RSS 最吸引我的地方，其实在于拒绝算法推荐
>
> 如今算法自作聪明地给用户打上了一个个标签，定义了画像，似乎比你自己还懂自己
>
> 而最可怕的地方在于，很多人却还没意识到：**自己正被算法所影响，变成了算法所认为的你**

## 参考资料

- [知道RSS的人越少，我就越希望它能被人知道！](https://zhuanlan.zhihu.com/p/349349861)
- [Vercel应用绑定自己的域名 | TANGLY’s BLOG](https://tangly1024.com/article/vercel-domain)
- [定期更新“bilibili视频动态”RSSHub订阅源Cookie | SuperMaxine's Blog](http://www.supermaxine.xyz/2022/04/16/定期更新bilibili视频动态RSS订阅源Cookie/)
