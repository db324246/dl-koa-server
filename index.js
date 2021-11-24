const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const routeUser = require('./utils/routeUser');
const handleError = require('./utils/handleError')
const session = require('koa-session')
const routePermission = require('./utils/routePermission')

const session_signed_key = ["some secret hurr"];  // 这个是配合signed属性的签名key
const sessionConfig = {
  key: 'koa:sess',   //cookie key (default is koa:sess)
  maxAge: 6000000,  // 过期时间(毫秒) maxAge in ms (default is 1 days)
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired,
};

app.keys = session_signed_key;
app.use(session(sessionConfig, app));

// post 请求体数据处理
app.use(bodyParser());

// 监听错误处理
app.use(handleError)

// 路由鉴权
app.use(routePermission);

// 挂载路由
app.use(routeUser());

app.listen(3000, () => {
  console.log('app started at port 3000...');
});