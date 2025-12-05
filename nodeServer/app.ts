
import Koa from 'koa'; // 使用 ES6 模块导入语法
import bodyParser from 'koa-bodyparser';
const { auth } = require('./middleware/jwt');
// 路由
import secureRouter from './routes/secure';
import publicRouter from './routes/public';
// import swaggerRouter from './routes/swagger';
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

app.use(bodyParser());

// 注册公开路由 (不需要认证)
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());


// **JWT 身份验证中间件**
// 放在所有需要保护的路由之前
app.use(auth);

// 注册受保护路由 (需要认证)
app.use(secureRouter.routes()).use(secureRouter.allowedMethods());
// **注册 Swagger 文档路由** (放在最后)
// app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});