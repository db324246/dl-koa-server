const { response } = require('../utils/index');
const basePath = require('../config/baseUrl.js');
// 不需要 token 的接口
const unNeedTokenApi = [
  '/current'
]
// 不需要 cookie 的接口
const unNeedCookieApi = [
  '/login',
  '/register'
]

const unNeedTokenUrls = unNeedTokenApi.map(i => basePath + i);
const unNeedCookieUrls = unNeedCookieApi.map(i => basePath + i);

module.exports = async (ctx, next) => {
  if (unNeedCookieUrls.includes(ctx.originalUrl)) {

    await next()

  } else if (unNeedTokenUrls.includes(ctx.originalUrl)) {
    const user = ctx.cookies.get('@user_id')
    if (user) await next()
    else ctx.response.body = response(401, '用户未登录')

  } else {
    const token = ctx.request.header.authorization
    const userId = ctx.session[token]

    if (userId && (ctx.cookies.get('@user_id') === userId)) await next()
    else ctx.response.body = response(403, '用户身份过期')
  }
}