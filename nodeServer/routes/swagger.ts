import path from 'path'
import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter()

if (process.env.NODE_ENV !== 'production') {
  router.swagger({
    title: 'Sparrow Node API',
    description: 'Koa + JWT + MVC + Swagger',
    version: '1.0.0',
    swaggerHtmlEndpoint: '/swagger-html',
    swaggerJsonEndpoint: '/swagger-json',
  })
}

router.mapDir(path.resolve(__dirname, '../controllers'))

export default router