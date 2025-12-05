import Router from 'koa-router'
import jsonwebtoken from 'jsonwebtoken' 
const { secret } = require('../middleware/jwt');

const router = new Router({ prefix: '/api/public' });

// 模拟数据库用户
const mockUsers: { [key: string]: { password: string; role: string } } = {
    'user1': { password: 'password1', role: 'admin' },
    'user2': { password: 'password2', role: 'guest' }
};

router.post('/login', async (ctx) => {
      console.log(ctx.request.body);
    const { username, password } = (ctx.request.body as { username?: string; password?: string }) || {};
    // 1. 验证用户名和密码
    if (!username) {
        ctx.status = 401;
        ctx.body = {
            code: -1,
            message: '用户名或密码错误'
        };
        return;
    }
    const user = mockUsers[username];
    if (user && user.password === password) {
        // 2. 登录成功，生成 JWT
        // payload 中包含用户信息，不应该包含敏感信息（如密码）
        const token = jsonwebtoken.sign(
            { 
                id: username,
                role: user.role,
                // token 签发时间
                iat: Math.floor(Date.now() / 1000), 
                // token 过期时间 (例如 1 小时)
                exp: Math.floor(Date.now() / 1000) + (60 * 60) 
            }, 
            secret
        );

        ctx.body = {
            code: 0,
            message: '登录成功',
            data: { token }
        };
    } else {
        // 3. 登录失败
        ctx.status = 401; // Unauthorized
        ctx.body = {
            code: -1,
            message: '用户名或密码错误'
        };
    }
});

export default router;