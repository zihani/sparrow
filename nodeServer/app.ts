
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

app.use(bodyParser());

app.use(auth);

app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});