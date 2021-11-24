const cookieConfig = (maxAge, signed) => {
  return {
    domain: 'localhost',  // 写cookie所在的域名
    path: '/',       // 写cookie所在的路径
    maxAge, // cookie有效时长
    signed,
   // expires: new Date('2017-02-15'),  // cookie失效时间
    httpOnly: false,  // 是否只用于http请求中获取
    overwrite: false  // 是否允许重写
  }
}

module.exports.cookieConfig = cookieConfig
