---
title: 前后端服务部署
published: 2024-02-17 18:46:18
draft: false
tags: [SpringBoot, SpringBootWeb, Java, Vue, Nginx, MySQL]
category: Full Stack
---

前端程序和后端程序在服务器上部署流程的记录

前端程序：Vue 开发  
后端程序：Java SpringBootWeb + Mysql + Mybatis

## 前端部署

### 本机导出文件

Vue 生成静态网页文件，`npm run deploy`

### 服务器部署文件

服务器上安装并启动 nginx 

```bash
sudo apt install nginx
service nginx start
```

配置文件路径在 `/etc/nginx` 可以找到默认端口 80、静态文件路径 `/var/www/html`

访问 ip:80 可以正常打开（打不开可能需要安全组开80端口

把最开始的静态文件放到 `/var/www/html` 刷新浏览器

## 后端部署

### 本机导出数据库数据

```bash
mysqldump -u root -p dbName > sqlFile.sql
```

### 本机导出 jar 包

war 包的话还需要服务器上安装 tomcat，方便起见导出 jar 包

pom.xml 中设置到处 jar  
```xml
<project>
  ...
  <packaging>jar</packaging>
</project>
```

application.properties 改好数据库端口密码，`maven package`，导出文件在 target/xx.jar

### 服务器导入数据库数据

```bash
sudo apt install mysql-server
# 默认密码
cat /etc/mysql/debian.cnf 或者用 root 用户直接登录
# 更改密码策略（弱密码可选）
SHOW VARIABLES LIKE 'validate_password%';
SET global validate_password.policy=0;
SET global validate_password.length=6;
# 更改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
# 创建数据库
CREATE DATABASE dbName;
# 导入数据库
mysql -uroot -p dbName < sqlFile.sql
```

### 服务器运行 jar 包

```bash
sudo apt install openjdk-17-jdk
java -jar xx.jar
```

正常运行，但是目前只是在终端会话中运行，终端结束时程序会停止。这里需要用 nohup(no hang up) 挂起

```bash
nohup java -jar xx.jar &
# 查找pid关闭
ps -aux | grep "xx.jar"
kill -9 PID
```