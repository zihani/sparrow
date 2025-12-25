
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { auth } from './middleware/jwt';
import swaggerRouter from './routes/swagger';
const app = new Koa();

// 错误处理中间件 (用于捕获 JWT 验证失败的错误)
app.use(async (ctx, next) => {
    try {
        await next();
        console.log('Request processed successfully');
    } catch (err: any) {
        if (err.status === 401) {
            ctx.status = 401;
        console.log('Request processed successfully');

            ctx.body = {
                code: 401,
                message: '认证失败或Token过期',
            };
        } else {
            // 其他错误
            throw err;
        }
    }
});
// 解决跨域问题
// CORS 中间件：处理跨域与预检请求
app.use(async (ctx, next) => {
  const origin = process.env.CORS_ORIGIN || '*';
  const allowCredentials = process.env.CORS_CREDENTIALS === 'true' ? 'true' : 'false';
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  ctx.set('Access-Control-Expose-Headers', 'Authorization');
  ctx.set('Access-Control-Allow-Credentials', allowCredentials);
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});

app.use(bodyParser());

// 在业务路由之前挂载 JWT 保护
app.use(auth);

// Swagger 路由（生产环境仅注册业务路由，文档端点关闭）
app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
