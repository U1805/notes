---
title: GIT 常用命令
published: 2023-07-12 13:05:56
draft: false
tags: [Git]
category: Tools
image: "./covers/branch.jpg"
---

GIT 是目前世界上最先进的分布式版本控制系统

| 版本 | 文件名      | 用户 | 说明                   | 日期       |
| ---- | ----------- | ---- | ---------------------- | ---------- |
| 1    | service.doc | 张三 | 删除了软件服务条款5    | 7/12 10:38 |
| 2    | service.doc | 张三 | 增加了License人数限制  | 7/12 18:09 |
| 3    | service.doc | 李四 | 财务部门调整了合同金额 | 7/13 9:51  |
| 4    | service.doc | 张三 | 延长了免费升级周期     | 7/14 15:17 |

> 所有的版本控制系统，其实只能跟踪文本文件的改动，比如TXT文件，网页，所有的程序代码等等
> 图片、程序、Word这类二进制文件只能对整个文件跟踪

## 简单理解 GIT

GIT 就像游戏的存档机制，可以在任务做到一定程度时存个档，然后继续游戏。后头可以读档或者开个新档(分支)

### git 安装后的设置

```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

#### 一些个人设置（可选

让Git显示颜色，会让命令输出看起来更醒目

```bash
git config --global color.ui true
```

新建一个 `.gitignore` 文件，提交时自动忽略一些特殊文件

```
# 排除所有.开头的隐藏文件:
.*
# 排除所有.class文件:
*.class

# 不排除.gitignore和App.class:
!.gitignore
!App.class
```

一个炫酷的历史版本显示，以后可以输 `git lg` 查看版本信息

```bash
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```


### 存档

![GIT 存档机制](https://www.liaoxuefeng.com/files/attachments/919020037470528/0)

工作区就是文件夹，版本库是文件夹下的隐藏目录 `.git`。版本库中又有暂存区 `stage` 和分支 `master`

GIT 的存档机制是先把东西放到暂存区，然后提交的时候把暂存区的东西上传到分支

```bash
git add <file>
git commit -m <message>
```

`git add .` 添加全部修改到暂存区

为什么这样设计？Git 比其他版本控制系统设计得优秀，因为 Git 跟踪并管理的是修改，而非文件。

### 读档

每次上传到分支都有一次记录，其中包括 commit_id 一个 SHA1 计算的大数，回档指定 commit_id 即可把分支的内容放回工作区里

```bash
git log
git reset --hard <commit_id>
```

> log 界面 q 退出，h 帮助
> 如果前面有做 git lg 的设置，可以用 git lg 代替 git log

在Git中，commit_id 可以用 `HEAD` 表示当前版本（实现上就是一个指针），上一个版本就是 `HEAD^` ，上上一个版本就是 `HEAD^^` ，当然往上100个版本写100个^比较容易数不过来，所以写成 `HEAD~100`

回档后后悔了，想恢复了怎么办呢？reset 最新的版本号就可以了

版本号实在忘记了可以用 `git reflog` 查看命令记录

#### 撤回修改

如果只是修改了文件，还没更新到暂存区  
丢弃修改，把文件恢复到暂存区中的状态，暂存区里没有就恢复到分支中的状态

```bash
git checkout -- <filename>
```

如果更新到暂存区，还没提交到版本分支  
把文件修改从暂存区放回工作区，然后丢弃修改

```bash
git reset HEAD <filename>
git checkout -- <filename>
```

如果提交到版本分支，还没推送到远程库  
分支后退，也就是前面的内容

```bash
git reset --hard <commit_id>
```

## 远程仓库

### 设置

由于本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以，需要一点设置

```bash
ssh-keygen -t rsa -C "youremail@example.com"
cat ~/.ssh/id_rsa.pub
```
GitHub -> Account settings -> SSH Keys -> Add SSH Key

内容填文件 `id_rsa.pub` 的内容


### 下载仓库

```bash
git clone <git@...>
```
> 第一次 clone 或 push 时有个 fingerprint 警告，输入 yes 回车即可

### 关联仓库

如果先有本地库，想要推到 Github 上。在 Github 上建一个新仓库，把本地库关联远程仓库，再把本地 main 分支推送到远程仓库

```bash
git remote add origin <git@...>
git push -u origin main
```

推送内容（第一次推送需要 `-u`）

```bash
git push origin main
```

删除关联（不怎么用到，还是记录一下

```bash
git remove rm origin
```

## 分支管理

![123](https://www.liaoxuefeng.com/files/attachments/919023260793600/0)

master 是主分支，项目的阶段性成果放在这里，就是仅用来发布新版本

dev 是开发版本的分支，在 main 的基础上修改，始终比 main 分支超前。在开发测试通过后，可以作为一个版本发布，就把 dev 合并到 main 上

因为开发人员不止一人的时候需要分工，各写各的部分（或者一个开发者同时开发多个新特性和改bug），A 和 B 分别在 dev 的基础上创建两个分支 michael 和 bob，时不时往 dev 上合并

- **创建分支**

```bash
git branch dev
```

- **切换分支**

```bash
git switch dev
```

- **查看分支**

```bash
git branch
```

- **合并分支**

```bash
git merge dev
```

这个是把指定分支合并到当前分支，所以是在 main 上执行的操作

- **删除分支**

```bash
git branch -d dev
```

因为创建、合并和删除分支非常快，所以Git鼓励你使用分支完成某个任务，合并后再删掉分支，这和直接在master分支上工作效果是一样的，但过程更安全。

- **解决冲突**

当然，dev_A 先合并 dev_B 再合并两个人各干各的，两份代码很容易就会有在同一行修改的情况（冲突）

dev_B 提交前可以先抓取最新的 dev

```bash
git pull
```

> 建立本地分支和远程分支的关联，使用 `git branch --set-upstream branch-name origin/branch-name`

GIT 提示冲突，打开冲突的文件会看到这样的字样：

```
Git is a distributed version control system.
Git is free software distributed under the GPL.
Git has a mutable index called stage.
Git tracks changes of files.
<<<<<<< HEAD
Creating a new branch is quick & simple.
=======
Creating a new branch is quick AND simple.
>>>>>>> feature1
```

Git用<<<<<<<，=======，>>>>>>>标记出不同分支的内容

修改确认后再提交就没问题了

- **bug 分支**

有时候开发到一半需要去解决一个 bug，当然创建一个新分支就可以，但是问题是现在的分支修改还不能提交（因为才做一半）

这时候可以先把工作区和暂存区存储起来，创建 bug 分支，改完 commit 后恢复现场

存储

```bash
git stash
```

恢复：存储是类似栈的形式保存的可以apply+drop，也可以pop

```bash
git stash list
git stash apply stash@{0}
git stash drop
```

```bash
git stash pop
```