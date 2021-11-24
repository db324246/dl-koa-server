const fs = require('fs');
const path = require('path');
const basePath = require('../config/baseUrl.js');

function addMapping(router, mapping) {
    for (const url in mapping) {
        if (url.startsWith('get ')) {
            const path = url.substring(4);
            router.get(basePath + path, mapping[url]);
            // console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('post ')) {
            const path = url.substring(5);
            router.post(basePath + path, mapping[url]);
            // console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    const files = fs.readdirSync(path.join(__dirname, '../routers'));
    const js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (const f of js_files) {
        let mapping = require(path.join(__dirname, '../routers/', f));
        addMapping(router, mapping);
    }
}

module.exports = function () {
    const router = require('koa-router')();
    addControllers(router);
    return router.routes();
};