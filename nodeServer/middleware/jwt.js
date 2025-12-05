const jwt = require('koa-jwt');

// ⚠️ 在实际项目中，Secret Key 应该存储在环境变量中，并使用强密码
const secret = 'YOUR_SUPER_SECRET_KEY';

// 排除不需要进行 JWT 验证的公共路径 (例如登录接口)
const unlessPath = [
    /^\/api\/public\/login/ // 允许访问 /api/public/login 接口，无需 token
];

module.exports = {
    // 用于路由保护的中间件
    auth: jwt({ secret }).unless({ path: unlessPath }),
    secret: secret,
};