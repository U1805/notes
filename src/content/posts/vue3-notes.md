---
title: VUE3代码片段
published: 2024-06-07
description: '记一些 Vue 中常用常忘的东西'
image: './covers/6aa94a0dd952e9e136ac914bbcd318e2422123aa.jpg'
tags: [vue, frontend]
category: 'frontend'
draft: false 
---

# 组件通信

## 父组件 → 子组件

父组件
```vue
<script setup lang="ts">
import { ref } from "vue"
const title = ref("我是子组件")
</script>

<template>
    <h1>父组件</h1>
    <Son :title="title"></Son>
</template>
```

子组件 
```vue
<script setup lang="ts">
import { defineProps } from "vue"
const { title } = defineProps(['title']) 
</script>

<template>
    <h1>{{ title }}</h1>
</template>
```

## 子组件 → 父组件

父组件

```vue
<script setup lang="ts">
import { ref } from "vue"

const msg = ref('')
const handleAdd = (item: any) => {
    msg.value += item
}
</script>

<template>
    <h1>父组件</h1>
    <Son @handleAdd="handleAdd"></Son>
    <h3>{{ msg }}</h3>
</template>
```

子组件

```vue
<script setup lang="ts">
import { defineEmits } from "vue"
const emit = defineEmits(['handleAdd'])
const handleTitle = () => {
    emit("handleAdd", '我是子组件传递的数据')
}

</script>
<template>
    <h1 @click="handleTitle">click here</h1>
</template>
```

## 用 ref 暴露子组件实例

父组件
```vue
<script setup lang="ts">
import { ref, onMounted } from "vue"

const myref = ref()
onMounted(() => {
    console.log(myref.value, '');
    console.log(myref.value.message);
    myref.value.handleAdd()
})
</script>

<template>
    <h1>父组件</h1>
    <Ref ref="myref"></Ref>
</template>
```

子组件
```vue
<script setup lang="ts">
import { defineExpose, ref } from "vue"
const message = ref("我是Ref子组件中的数据")
const handleAdd = () => {
    console.log('我是Ref子组件中的方法');
}

defineExpose({
    message,
    handleAdd
})
</script>

<template>
    我是ref方法
</template>
```

# watch

## 基础类型

```typescript
const nums = ref(9)

watch(nums, (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
```

## Object类型

```typescript
const demo = reactive({})

// 这个对象
watch(demo, (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
// 单个属性
watch(() => demo.name, (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
```

## 组合监听

```typescript
watch([() => demo.name, nums], ([newName, newNums], [oldName, oldNums]) => {
	console.log('watch 已触发: name', newName)
	console.log('watch 已触发: nums', newNums)
})
```