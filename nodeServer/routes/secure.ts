import Router from "koa-router";

const router = new Router({ prefix: '/api/secure' });

// 模拟列表数据
const mockList = [
    { id: 1, name: 'Item A', content: 'Protected content 1' },
    { id: 2, name: 'Item B', content: 'Protected content 2' },
    // ... 更多数据
];

// 获取列表接口
router.get('/list', async (ctx) => {
    // 在 JWT 验证成功后，用户信息会被放在 ctx.state.user 中
    const user = ctx.state.user; 
    
    // 可以基于用户角色进行进一步的权限判断 (例如：只有 admin 才能访问)
    if (user.role === 'admin' || user.role === 'guest') {
        ctx.body = {
            code: 0,
            message: '获取列表成功',
            data: {
                // 示例：可以根据角色返回不同的数据或字段
                items: mockList, 
                userRole: user.role
            }
        };
    } else {
        ctx.status = 403; // Forbidden
        ctx.body = {
            code: -2,
            message: '权限不足'
        };
    }
});

export default router;