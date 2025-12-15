import jwt from 'koa-jwt'

export const secret = process.env.JWT_SECRET ?? 'YOUR_SUPER_SECRET_KEY'

const unlessPath = [/^\/api\/public\/login/, /^\/swagger-html/, /^\/swagger-json/]

export const auth = (jwt({ secret }) as any).unless({ path: unlessPath })