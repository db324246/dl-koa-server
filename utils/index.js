const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; //密钥--可以随便写
const iv = crypto.randomBytes(16);

module.exports.stringify = (data) => {
  if (typeof data === 'string') return data
  else return JSON.stringify(data)
}

module.exports.parse = (str) => {
  if (typeof str !== 'string') return str
  else return JSON.parse(str || '[]')
}

module.exports.response = (status, message, data) => {
  const res = {
    status,
    message
  }

  data && (res.data = data)
  return res
}

module.exports.requiredParams = (keys, Obj) => {
  for (let i = 0, len = keys.length; i < len; i++) {
    if (!Obj[keys[i]]) return ({
      status: 400,
      message: `${keys[i]} is required`
    })  
  }
  return false
}

module.exports.timeParse = (_date, format = '{y}-{m}-{d} {h}:{i}') => {
  const date = new Date();
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })

  return time_str
}

module.exports.queryObj = obj => {
  const del = []
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') del.push(key)
  }
  del.forEach(k => Reflect.deleteProperty(obj, k))
  return obj
}

module.exports.defined = (val) => {
  return val !== undefined && val !== null
}

module.exports.forEach = (arr, handler) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    const res = handler(arr[i], i);
    switch (res) {
      case 0:
        return;
      case 1:
        continue;
    }    
  }
}

// 字符加密
module.exports.encrypt = str => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(str), cipher.final()]);

  return JSON.stringify({
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  });
}

// 字符解密
module.exports.decrypt = hash => {
  const { iv, content} = JSON.parse(hash)
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

  return decrpyted.toString();
}