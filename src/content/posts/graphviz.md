---
title: Graphviz 的基本使用
published: 2023-10-19 23:49:22
draft: false
tags: [graphviz, python]
category: Tools
---


## 安装

Graphviz 工具安装 [官网](http://www.graphviz.org/)

Graphviz 库安装

```bash
pip install graphviz
```

## 用法

### demo

```python
g = Digraph('g', filename='linearhashtable.gv', node_attr={'shape': 'record', 'height':'.1', "rankdir": "LR"})
g.format = 'jpg'

# 生成图片节点，name：这个节点对象的名称，label:节点名,color：画节点的线的颜色
g.node(name='a', label='Ming', color='green')
g.node(name='b', label='Hong', color='yellow')
g.node(name='c', label='Dong')

# 在节点之间画线，label：线上显示的文本,color:线的颜色
g.edge('a', 'b', label="ab\na-b", color='red')
# 一次性画多条线，c到b的线，a到c的线
g.edges(['cb', 'ac'])

g.view() # 不打开使用 g.render(view=False)
```

### 结构体

有向图 digraph，无向图 graph

```python
g.node('table', label="<f1>A|<f2>B|<f3>C|<f4>D")
g.edge(f'table:f1', 'node_name')
```
![](https://cdn.luogu.com.cn/upload/pic/28624.png)
```python
g.node('table', label="{A|B|C|D}")
```
![](https://cdn.luogu.com.cn/upload/pic/28625.png)

### 参考资料

https://www.luogu.com.cn/blog/ryoku/graphviz

https://www.cnblogs.com/Zzbj/p/11431015.html