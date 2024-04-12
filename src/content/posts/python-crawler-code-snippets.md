---
title: Python 爬虫常用代码片段
published: 2024-03-06 23:40:00
draft: false
tags: [Python, Crawler]
category: Crawler
image: "./covers/13.jpg"
---

# python 爬虫

## 用户设置

### 🐭设置 HEADER

```python
import requests
header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    } 
res = requests.get('https://www.douban.com/', headers=header) 
```

### 🚀设置代理 PROXY

```python
proxies = {
  'http': 'http://127.0.0.1:7890',
  'https': 'http://127.0.0.1:7890',
}
res = requests.get('https://www.douban.com/', proxies=proxies) 
```

## HTTP 请求

### ➡️GET 请求页面

```python
res = requests.get('https://www.jd.com/')
```

### ⬅️POST 请求

```python
res = requests.post('http://www.xxxx.com', data={"key": "value"}) 
```

## 解析响应

### 🏞️二进制数据(eg.图片)

```python
res = requests.get(url)
with open('./cover.jpg', 'wb') as f:
    f.write(res.content)
```

### 📊json 数据

```python
import json
res = requests.get(url)
print(json.loads(res.text))
```

### 📑HTML 页面

```python
from bs4 import BeautifulSoup
soup = BeautifulSoup(res.text,'html.parser')

print(soup.prettify())  # 按照标准的缩进格式输出
```

元素选择

```python
elements = soup.select('#id') #选择器语法和css类似，返回list
```

元素属性

```python
element = elements[0]
print(element['name'])
print(element.get_text())
```

## 一些爬虫技术

### 😴随机睡眠

```python
import time
import random

time.sleep(random.uniform(0,5))
```

### 🔁超时重试

```python
from requests.adapters import HTTPAdapter

s = requests.Session()
s.mount('http://', HTTPAdapter(max_retries=3))  # 超时重试3次
s.mount('https://', HTTPAdapter(max_retries=3))
res = s.get('http://www.xxxx.com', timeout=(10, 27))  # (connect超时, read超时)
```

### ⚟多线程运行

```python
import threading

# 信号量，用来限制线程数
max_connections = 3
pool_sema = threading.BoundedSemaphore(max_connections)

url_list = [] # 目标url列表
def craw_url(url): # 主要功能函数
    pass
    pool_sema.release()

thread_list = []
for i in url_list:
    pool_sema.acquire()
    thread = threading.Thread(target=craw_url, args=(i,))
    thread.start()
    thread_list.append(thread)
for t in thread_list:
    t.join()
```

## 其他功能实现

### 新建文件夹

```python
import os

if not os.path.isdir(dir_path):
    os.mkdir(dir_path)
```

### 日志输出

引入 `logging` 后 `logging.info()` 即可，但是在 Jupyter notebook 中需要先设置一下：

```python
import logging
logger = logging.getLogger()
 
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
 
# Setup file handler
fhandler  = logging.FileHandler('my.log') # 日志输出到 my.log
fhandler.setLevel(logging.DEBUG)
fhandler.setFormatter(formatter)
 
# Configure stream handler for the cells
chandler = logging.StreamHandler()
chandler.setLevel(logging.DEBUG)
chandler.setFormatter(formatter)
 
# Add both handlers
logger.addHandler(fhandler)
logger.addHandler(chandler)
logger.setLevel(logging.DEBUG)
 
# Show the handlers
logger.handlers

logger.info()
```

