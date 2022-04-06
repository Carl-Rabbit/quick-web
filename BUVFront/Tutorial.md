VUE知识点

最新的 Vue tutorial (3 hours)

 https://www.youtube.com/watch?v=FXpIoQ_rT_c&ab_channel=freeCodeCamp.org

### 1. VUE CLI (vue开发工具)
https://cli.vuejs.org/zh/

npm install 

npm install --save **

npm build

npm serve vs vue ui(vue项目管理程序)

### 2. VUE 常用配套插件

##### 2.1 UI界面： element-ui

https://element.eleme.cn

##### 2.2 状态管理工具：
https://vuex.vuejs.org/

##### 2.3 HTTP库

Vue-axios

Vue-resource

### 3. 可视化库

D3 https://d3js.org/

Threejs https://threejs.org/

Echarts https://github.com/ecomfe/vue-echarts

### 4. Vue project 与 Flask 架构
Vue modules:
* Component -> 视图
* Service -> 通信服务
* Router -> 页面路由
* State -> 状态与数据

Vue 与 flask 通信 （http）

Vue使用plugin

### 5.  Vue components
* HTML/CSS/Javascript
  * \<template>
  * \<script> 
  * \<style> (scoped)
* Components 模块
  * 生命周期：created, mounted, destroyed ...
  * 数据传递：props
  * 注册子模块：components 
  * 局部数据：data
  * 局部方法：methods
  * 监控：watch
  * 计算属性： computed
  * 属性，数据混入：mixins

#### 6. Vue and D3:
* 原则：尽量少用D3，如需使用D3进行视图元素操作，需要确定该元素已经被创建
* Vue：架构页面； D3 提供交互和计算
* 逐层传递数据，尽量减少数据的深度备份
* 需要进行**双向绑定**的属性需要在**数据创建**（绑定之前）的时候进行赋值，否则无法监控到变化；
* 跨视图/模块交互的实现方式
  * 数据绑定
  * 管道法