const { response } = require('../utils/index');

module.exports = async (ctx, next) => {
  try {
      await next();   // 执行后代的代码
      if (!ctx.body) {  // 没有资源
        ctx.response.body = response(404, 'not found')
      }
  } catch(e) {
      // 如果后面的代码报错 返回500
      ctx.response.body = response(500, 'server error')
  }
}