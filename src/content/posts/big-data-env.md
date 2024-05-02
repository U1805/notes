---
title: 大数据环境搭建
published: 2024-04-28
description: 'Hadoop 等环境配置'
image: ''
tags: [Big Data, Hadoop, HBase]
category: 'Big Data'
draft: false 
---

## 前言

大数据课的 Hadoop 环境天天搭，搭了几百遍了，还不如今天自己记录一下过程呢 (／‵Д′)／~ ╧╧

## 一、Hadoop

安装参考：[在 Ubuntu 22.04 LTS 上搭建 Hadoop 环境 – DGideas' Blog](https://dgideas.net/2022/install-hadoop-on-ubuntu-22-04/)

Hadoop 基础环境包含：大数据分析框架 Hadoop、用于进行数据分布式分析的 MapReduce，以及用于分布式存储数据的 Hadoop 文件系统（HDFS）三部分。

### 安装前的准备工作

出于[权限隔离最佳实践](https://www.ibm.com/developerworks/cn/linux/l-cn-rootadmin1/index.html)的考虑，我们在系统中考虑为 Hadoop 创建单独的用户账户和组，然后切换到 Hadoop 用户

> 实验环境里为了方便部署可以把 hadoop 加入 sudo 身份组（虚拟机权限随便浪 无视风险继续执行

```bash
sudo adduser hadoop
sudo adduser hadoop sudo
su hadoop
```

Hadoop 基础组件及其外围项目大多是基于 Java 的，Hadoop 官方文档中说明了对 Java 版本[支持情况](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions)。  
同时 Hadoop 框架使用 SSH 协议与本地/远程计算机进行通信，需要安装 SSH 服务器守护程序，为本地环境 `hadoop` 用户生成公-私密钥对：

```bash
sudo apt install openjdk-11-jdk openssh-server
sudo -u hadoop ssh-keygen -b 4096 -C hadoop
sudo -u hadoop ssh-copy-id -p 22 localhost
```

### 下载 Hadoop

Hadoop 官方网站的[下载页面](https://hadoop.apache.org/releases.html)  
我们准备将相关发行版本安装至文件系统的 `/opt` 目录下（另一个标准选择是 `/usr/local`）  
并赋予 `hadoop` 用户 Hadoop 软件目录的拥有权：

```bash
wget "https://dlcdn.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz"
sudo tar -zxvf hadoop-3.3.6.tar.gz -C /opt
sudo chown hadoop:hadoop -R /opt/hadoop-3.3.6	
cd /opt/hadoop-3.3.6
```

### 配置 Hadoop 相关环境变量

安装 Hadoop 后，我们需要正确设置以下环境变量，刷新设置

```bash
# ~/.bashrc
export HADOOP_HOME=/opt/hadoop-3.3.6
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"

source ~/.bashrc
```

### 配置 Hadoop 基础框架

告诉 Hadoop 有关 JRE 的位置信息
```bash
# ./etc/hadoop/hadoop-env.sh
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export HADOOP_SSH_OPTS="-p 22"
```

Hadoop 生态的大多数组件采用 `.xml` 文件的方式进行配置。它们采用了统一的格式：
```xml
<configuration>
    <property>
        <name>配置项名称</name>
        <value>配置值</value>
    </property>
</configuration>
```

#### Hadoop 的核心变量

配置位于 `./etc/hadoop/core-site.xml` 配置文件中：

| 配置项 | 值 |
|---|---|
| `fs.defaultFS` | `hdfs://localhost:9000` |
| `hadoop.http.staticuser.user` | `hadoop` |

#### 配置 HDFS（Hadoop 文件系统）

编辑 `./etc/hadoop/hdfs-site.xml` 文件

指定 NameNode 与 DataNode 的存储位置。我们计划将 NameNode 与 DataNode 存储于本地文件系统上，即存放于 `~/hdfs` 中：

```bash
mkdir -p ~/hdfs/namenode ~/hdfs/datanode
```

| 配置项 | 值 |
|---|---|
| `dfs.replication` | `1` |
| `dfs.name.dir` | `/home/hadoop/hdfs/namenode` |
| `dfs.data.dir` | `/home/hadoop/hdfs/datanode` |

首次启动 Hadoop 环境之前，我们需要初始化 Namenode 节点数据：

```bash
hdfs namenode -format
```

> 忘记初始化 Namenode 节点可能导致遇到 `NameNode is not formatted` 错误。  


#### 配置 MapReduce（由 YARN 驱动）

MapReduce 是一种简单的用于数据处理的编程模型，YARN是 Hadoop 的集群资源管理系统。  

编辑 `./etc/hadoop/mapred-site.xml` 文件

| 配置项 | 值 |
|---|---|
| `mapreduce.framework.name` | `yarn` |

编辑 `./etc/hadoop/yarn-site.xml` 文件：

| 配置项 | 值 |
|---|---|
| `yarn.nodemanager.aux-services` | `mapreduce_shuffle` |
| `yarn.resourcemanager.hostname` | `localhost` |

### 启动 Hadoop 集群环境

```bash
start-dfs.sh      #localhost:9870
start-yarn.sh     #localhost:8088
mr-jobhistory-daemon.sh start historyserver
jps
```

HDFS Shell
```bash
# 显示根目录 / 下的文件和子目录，绝对路径
hadoop fs -ls /
# 新建文件夹，绝对路径
hadoop fs -mkdir /hello
# 上传文件
hadoop fs -put hello.txt /hello/
# 下载文件
hadoop fs -get /hello/hello.txt
# 输出文件内容
hadoop fs -cat /hello/hello.txt
```

## 二、HBase

### 下载 HBase

```bash
wget "https://archive.apache.org/dist/hbase/2.5.4/hbase-2.5.4-bin.tar.gz"
sudo tar -zxvf hbase-2.5.4-bin.tar.gz -C /opt
sudo chown -R hadoop ./hbase-2.5.4-bin
```

环境变量添加

```bash
export PATH=$PATH:/opt/hbase-2.5.4-bin/bin
```

### 伪分布式模式配置

编辑 `conf/hbase-env.sh`

```bash
export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_371
export HBASE_CLASSPATH=/usr/local/hbase/conf 
export HBASE_MANAGES_ZK=true
```

编辑 `conf/hbase-site.xml`

| 配置项 | 值 |
|---|---|
| `hbase.rootdir` | `hdfs://localhost:9000/hbase` |
| `hbase.cluster.distributed` | `true` |
| `hbase.unsafe.stream.capability.enforce` | `false` |

### 启动 HBase

```bash
start-dfs.sh
start-hbase.sh
```

进入命令行模式

```bash
hbase shell
exit
```

> 如果进入后出现报错：  
> ERROR: org.apache.hadoop.hbase.ipc.ServerNotRunningYetException: Server is not running yet  
>
> 就是 slf4j 相关的jar在hadoop和hbase中重复，但在 3.3.5 版本中，已经改名叫做 slf4japi  
> 编辑 `conf/hbase-env.sh` 去掉注释：  
> `export HBASE_DISABLE_HADOOP_CLASSPATH_LOOKUP="true"`

Shell 命令
```bash
create 'student','Sname','Ssex','Sage','Sdept','course'

put 'student','95001','Sname','LiYing'
put 'student','95001','course:math','80'
put 'student','95001','Ssex','Male'

get 'student','95001'
scan 'student'

delete 'student','95001','Ssex'
deleteall 'student','95001'

disable 'student'  
drop 'student'
```

![](./meme/isbudslo.jpg)