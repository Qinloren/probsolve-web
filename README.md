<div align="center">
  <h1>🐔 刷题鸡（ProbSolve Web）</h1>
  <p>一个前后端分离的在线刷题系统 · 前端项目</p>

![](https://img.shields.io/badge/Vue-%5E3.5.22-brightgreen)
![](https://img.shields.io/badge/Vite-%5E7.x-blue)
![](https://img.shields.io/badge/Pinia-%5E3.0.3-brightgreen)
![](https://img.shields.io/badge/Vue%20Router-%5E4.6.3-brightgreen)
![](https://img.shields.io/badge/Ant%20Design%20Vue-4.x-blue)

![](https://img.shields.io/github/forks/Qinloren/probsolve-web?style=flat)
![](https://img.shields.io/github/stars/Qinloren/probsolve-web?style=flat)
![](https://img.shields.io/github/issues/Qinloren/probsolve-web)
![](https://img.shields.io/github/v/release/Qinloren/probsolve-web)
![](https://img.shields.io/badge/license-Apache%202.0-yellow)
</div>

---

## 📖 项目简介

**刷题鸡（ProbSolve）** 是一个基于 **前后端分离架构** 的在线刷题系统，本仓库为 **前端工程**。

项目目标是提供一个简洁、高效、可扩展的刷题平台，支持用户进行题目练习、题库管理以及个人数据查看，适合作为：

- 编程刷题系统
- 教学 / 校园练习平台
- 全栈项目学习与实践示例

---

## ✨ 当前已实现功能

> 当前版本为 **基础功能版本**，持续迭代中

- ✅ 用户登录 / 注册
- ✅ 在线刷题
- ✅ 个人中心
    - 个人资料查看
    - 我的题库
- ✅ 前后端接口完全分离
- ✅ 状态管理持久化（Pinia）

---

## 🧱 技术栈

### 前端

- **Vue 3**（Composition API）
- **Vite**（极速构建）
- **TypeScript**
- **Vue Router**
- **Pinia** + `pinia-plugin-persistedstate`
- **Ant Design Vue**
- **Axios**
- **ECharts / vue-echarts**
- **UnoCSS**
- **SCSS**

---

## 📁 项目结构（简要）

```text
src/
├─ assets/            # 静态资源
├─ components/        # 通用组件
├─ views/             # 页面级组件
├─ router/            # 路由配置
├─ store/             # Pinia 状态管理
├─ api/               # 接口请求封装
├─ utils/             # 工具函数
├─ main.ts            # 入口文件
├─ .env               # 通用环境变量
├─ .env.development   # 开发环境变量
└─ .env.production    # 线上环境变量
```

## 📦 快速上手

### 1. 克隆项目

```bash
git clone https://github.com/Qinloren/probsolve-web.git
cd probsolve-web
```

### 2. 安装包管理器
```bash
npm install -g pnpm
```

### 3. 安装项目依赖
```bash
pnpm i
```

### 4. 配置后端接口地址
项目根目录.env文件中编辑，示例如下：
```env
VITE_SERVER_URI=后端接口域名
VITE_SERVER_SSL=是否开启https
VITE_WS_SSL=本项暂时无用
```

### 5. 启动项目
```bash
pnpm run dev
```
访问地址: `http://localhost:5173`

### 6. 构建项目
```bash
pnpm run build
```
构建结果存放于`dist/`目录中，可通过`Nginx`等其他环境进行部署上线

### 7. 打包 Docker 镜像
```bash
docker build -t 镜像名:镜像标签 .
```

### 8. 运行 Docker 镜像
```bash
docker run -d -p 80:80 镜像名:镜像标签
```
访问地址: `http://localhost`

## 📄 License
本项目遵循 Apache License 2.0协议

## ⭐ 致谢
如果这个项目对你有帮助，欢迎点个Star支持一下！