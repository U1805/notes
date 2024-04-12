---
title: FFmpeg 代码片段
published: 2024-03-06 23:42:00
draft: false
tags: [FFmpeg, Video]
category: Cli-tools
image: "./covers/FijuOKZaMAE451l.png"
---

# ffmpeg

https://www.ffmpeg.org/

## 前置概念

### 容器（视频文件）

视频文件 = 视频 + 音频 + 字幕 + ...

`ffmpeg -formats`

### 编码与编码器

视频编码 -- 视频编码器

```
H.262
H.264 -- libx264(开源)/NVENC(基于NVIDIA GPU)
H.265 -- libx265(开源)
VP8   -- libvpx
VP9   -- libvpx
AV1   -- libaom
```

音频编码

```
MP3 -- 
AAC -- libfdk-aac/aac
```

查看编码 `ffmpeg -codecs`

查看编码器 `ffmpeg -encoders`

## 使用方法

### 参数格式

```bash
ffmpeg [全局参数] \
[输入文件参数] \
-i [输入文件] \
[输出文件参数] \
[输出文件]
```

### 全局参数

> `-y`：不经过确认，输出时直接覆盖同名文件。

### 文件参数

> - `-c`：指定编码器
>     - `-c copy`：直接复制，不经过重新编码（这样比较快）
>     - `-c:v`：指定视频编码器
>     - `-c:a`：指定音频编码器
> - `-minrate` 最小码率 `-maxrate` 最大码率 `-bufsize` 缓冲区大小
> - `-an` 去除音频流 `-vn` 去除视频流
> - `-preset`：指定输出的视频质量，会影响文件的生成速度，有以下几个可用的值 
>     ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow。

## 常用命令

### 查看文件元信息

可以查看编码格式和比特率

```bash
ffmpeg -i input.mp4 -hide_banner
```

### 转换编码

```bash
ffmpeg \
-i input.mp4 \ 
-c:v libx265 \ # 原编码->H.265(原编码自动判断)
output.mp4
```

### 转换容器

```bash
ffmpeg \
-i input.mp4 \
-c copy \ # 内部的编码格式不变，所以使用 `-c copy` 指定直接拷贝，不经过转码
output.webm
```

### 改变分辨率

设置视频的宽度为480像素，高度自动调整以保持纵横比不变

```bash
ffmpeg \
-i input.mp4 \
-vf scale=480:-1 \ # -vf 视频滤镜
output.mp4
```

### 提取音频

```bash
ffmpeg \
-i input.mp4 \
-vn -c:a copy \ # -vn 跳过视频 -c:a copy 音频编码直接拷贝
output.aac
```

### 添加音轨

```bash
ffmpeg \
-i input.acc -i input.mp4 \
output.mp4
```

### 截图

```bash
ffmpeg -y \
-ss 00:01:24 -t 00:00:01 \ # 开始时间 持续时间
-i input.mp4 \
-q:v 2 \ # 图片质量(1-5 1最高)
output_%3d.jpg
```

```bash
ffmpeg -y \
-ss 00:01:24 -t0 00:01:25 \ # 开始时间 结束时间
-i input.mp4 \
output_%3d.jpg
```

```bash
ffmpeg \
-ss 01:23:45 \ # 开始时间
-i input \
-vframes 1 \ # 帧数
output.jpg
```

### 截取

三种定位方式与截图相同

```bash
ffmpeg \
-ss 00:01:50 -t 10.5 \ # 开始时间 持续时间
-i input.mp4 \
-c copy \
output.mp4
```

### 音频添加封面

```bash
ffmpeg \
-loop 1 \ # 图片无限循环
-i cover.jpg -i input.mp3 \
-c:v libx264 -c:a aac -b:a 192k -shortest \ # -b:a 音频码率 -shortest 当最短输出流结束时完成编码
output.mp4
```

