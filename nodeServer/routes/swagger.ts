// routes/swagger.ts
// import { swaggerSetting, register } from 'koa-swagger-decorator';
import * as swaggerDecorator from 'koa-swagger-decorator';
// import { swaggerSetting, register } from 'koa-swagger-decorator';
import Router from 'koa-router';
// 导入你的路由文件，确保它们被 register 扫描到
import publicRouter from './public'; 
import secureRouter from './secure';

const router = new Router();

// 1. 设置 Swagger 文档的基本信息
swaggerDecorator.swaggerSetting({
    title: 'Koa.js 权限系统 API 文档',
    description: '使用 Koa-Swagger-Decorator 自动生成的接口文档',
    version: '1.0.0',
    swaggerHtmlEndpoint: '/swagger-html', // 浏览器访问的路径
    swaggerJsonEndpoint: '/swagger-json', // JSON 规范文件路径
    // 如果您的路由文件在 routes 目录下，这里可以写 routes/**/*.ts
    // 但为了明确，我们直接在下面 register 了
    // prefix: '/api' // 如果您的所有路由都有 /api 前缀，可以设置
});

// 2. 注册所有路由
// register() 会扫描您项目中的所有被 @request、@path 等装饰器修饰的路由
// 自动生成 Swagger 文档所需的信息。
// 我们将所有 Koa 路由实例作为参数传入。
swaggerDecorator.register(router, [publicRouter, secureRouter]); 

export default router;