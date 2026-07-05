# 学之道 (XueZhiDao)

智能教辅与题库管理平台，面向教师端和学生端提供题库录入、班级管理、作业分发、练习测评、错题本、排行榜、学情分析和 AI 辅助答疑等功能。

## 功能概览

- 教师端：教师工作台、题库管理、DOCX/文本试题解析、班级管理、邀请码入班、作业布置、作业批改、学情分析、排行榜。
- 学生端：学生工作台、加入班级、作业列表、沉浸式练习、专项练习、错题本、个人学习分析、排行榜、个人资料维护。
- 题型支持：单选题、多选题、判断题、填空题、简答题、阅读理解、连线题、翻译题、改错题、编程题、完形填空、古诗默写等。
- 内容渲染：支持 KaTeX 数学公式渲染，支持题干、选项、解析中的图文内容。
- 鉴权与权限：基于 JWT 的登录态管理，前端路由按教师/学生角色拦截，接口统一携带 Authorization。

## 技术栈

### 前端

- Vue 3
- Vue Router
- Pinia
- Vite 8
- KaTeX
- Cropper.js

### 后端

- Node.js 20+
- Express
- PostgreSQL
- JWT + bcryptjs
- Multer
- adm-zip
- OpenAI API 兼容接口
- MinerU 文档解析接口

## 目录结构

```text
xuezhidao/
├── src/                         # Vue 前端
│   ├── components/              # 通用组件与题型组件
│   ├── router/                  # 前端路由与权限守卫
│   ├── services/                # 前端 API 请求封装
│   ├── stores/                  # Pinia 状态
│   ├── utils/                   # 数学公式/内容渲染工具
│   └── views/                   # 学生端与教师端页面
├── server/                      # Express 后端
│   ├── sql/schema.sql           # 数据库表结构与迁移补丁
│   ├── src/controllers/         # 控制器
│   ├── src/routes/              # REST API 路由
│   ├── src/services/            # 业务服务与文档解析
│   └── src/scripts/             # 数据库脚本
├── scripts/                     # 文档解析辅助脚本
├── docx/                        # DOCX 解析样例与中间材料
└── 项目说明文档.md              # 更完整的项目说明
```

## 本地运行

### 1. 安装依赖

```bash
npm install
cd server
npm install
```

### 2. 配置后端环境变量

在 `server/.env` 中配置：

```env
PORT=4000
DATABASE_URL=postgres://用户名:密码@localhost:5432/数据库名
JWT_SECRET=请替换为安全随机字符串
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

OPENAI_API_KEY=
OPENAI_MODEL=deepseek-chat
OPENAI_BASE_URL=https://api.openai.com/v1

MINERU_API_URL=https://mineru.net/api/v4/file-urls/batch
MINERU_API_TOKEN=
MINERU_API_RESULT_URL=https://mineru.net/api/v4/extract-results/batch
MINERU_MODEL_VERSION=vlm
```

说明：

- `DATABASE_URL` 是必填项；未配置时后端可以启动，但访问数据库接口会失败。
- `OPENAI_*` 和 `MINERU_*` 只在使用智能文档解析功能时需要。
- `server/.env` 已被 `.gitignore` 忽略，不要提交真实密钥。

### 3. 初始化数据库

```bash
cd server
npm run migrate
```

该命令会执行 `server/sql/schema.sql`，创建或补齐项目需要的数据表与字段。

### 4. 启动后端

```bash
cd server
npm run dev
```

默认接口地址：`http://localhost:4000/api`

### 5. 启动前端

```bash
npm run dev
```

默认前端地址：`http://localhost:5173`

## 常用命令

```bash
npm run build        # 前端生产构建
npm run lint         # 前端 lint
cd server && npm run migrate
cd server && npm run dev
cd server && npm start
```

## 主要页面

- `/loginregistrationupdatedowl`：登录页
- `/registrationupdatedimage`：注册页
- `/teacherdashboard`：教师工作台
- `/questionbank`：题库管理
- `/classmanagement`：班级管理
- `/assignhomework`：布置作业
- `/teachergrading`：作业批改
- `/studentdashboard`：学生工作台
- `/studentclasses`：学生班级
- `/studenthomeworklist`：学生作业
- `/practice-session`：练习会话
- `/studenterrorbook`：错题本
- `/aiaiassistant`：AI 助手

## 说明

- `server/uploads/` 用于运行期上传文件，默认不提交到 Git。
- `dist/` 是前端构建产物，默认不提交到 Git。
- 数据库备份文件 `server/*.dump` 默认不提交到 Git。
