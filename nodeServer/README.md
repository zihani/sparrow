# Sparrow NodeServer 项目文档

## 项目简介

一个基于 Koa 的 TypeScript 服务，采用 MVC 分层，集成 JWT 认证与基于装饰器的 Swagger 文档（仅开发环境开放）。

## 技术栈

- Koa、koa-router、koa-bodyparser
- JWT：`koa-jwt`、`jsonwebtoken`
- TypeScript
- Swagger：`koa-swagger-decorator`

## 目录结构

```
nodeServer/
├─ app.ts                 # 应用入口
├─ controllers/           # 控制器（业务逻辑 + swagger 装饰器）
│  ├─ authController.ts
│  └─ secureController.ts
├─ models/                # 模型（数据结构与数据源）
│  ├─ item.ts
│  └─ user.ts
├─ middleware/            # 中间件
│  └─ jwt.ts              # JWT 认证（支持白名单）
├─ routes/                # 路由（由 SwaggerRouter 映射控制器）
│  └─ swagger.ts          # SwaggerRouter 配置（生产环境禁用文档端点）
├─ package.json
└─ tsconfig.json
```

## 安装与运行

```bash
# 安装依赖
npm install

# 开发启动（开放 swagger）
npm run dev

# 编译
npm run build

# 生产启动（禁用 swagger）
npm run start:prod
```

## 环境变量

- `JWT_SECRET`：JWT 密钥，默认值为 `YOUR_SUPER_SECRET_KEY`

设置示例：

```bash
export JWT_SECRET="your-strong-secret"
```

## 接口说明

- 登录：`POST /api/public/login`
  - 请求体：`{ "username": "user1", "password": "password1" }`
  - 响应体：`{ code, message, data: { token } }`

- 受保护列表：`GET /api/secure/list`
  - 需请求头：`Authorization: Bearer <token>`
  - 响应体：`{ code, message, data: { items, userRole } }`

示例：

```bash
# 获取 token
TOKEN=$(curl -s -X POST http://localhost:3000/api/public/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}' | node -p "var s=require('fs').readFileSync(0,'utf8'); JSON.parse(s).data.token")

# 访问受保护接口
curl -s http://localhost:3000/api/secure/list -H "Authorization: Bearer $TOKEN"
```

## Swagger 文档（开发环境）

- UI：`/swagger-html`
- JSON：`/swagger-json`
- 生产环境不开放文档端点，但路由仍由 `SwaggerRouter.mapDir` 映射控制器方法。

## 认证与白名单

- 中间件位置：`middleware/jwt.ts`
- 白名单端点：
  - `^/api/public/login`
  - `^/swagger-html`（仅开发）
  - `^/swagger-json`（仅开发）

## 设计说明（MVC）

- 路由：由 `SwaggerRouter` 扫描 `controllers` 自动注册
- 控制器：处理业务逻辑与响应，并用装饰器生成文档
- 模型：定义数据结构与数据来源（当前用内存模拟）
- 中间件：跨切面能力（鉴权、解析、错误处理等）

## 安全建议

- 在生产中务必设置强密码的 `JWT_SECRET`
- 避免在日志中输出敏感信息
- 根据角色与权限控制接口返回内容

## 常见问题

- 生产无法访问 swagger：属正常行为，使用 `start:prod` 时文档端点关闭
- 启动端口占用：停止已有进程或修改端口后再启动