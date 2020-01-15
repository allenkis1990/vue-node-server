/**
 * Created by Allen Liu on 2019/9/6.
 */
var path = require('path')
global.require = function(p){
    //console.log(p);
    var baseReg = /^@base\//ig
    var hasBase = baseReg.test(p)
    if(hasBase){
        p =  './'+p.replace(baseReg,'')
        //console.log(p);
        try{
            require.resolve(p)
        }catch(e){
            if(e){
                var parentAbsoultPath = path.resolve(__dirname,'../','parent')
                var relativePath = path.relative('./',parentAbsoultPath)
                var parentFilePath = path.resolve(relativePath, p)
                //console.log(relativePath);
                return require(parentFilePath,p)
            }
        }
        return require(p)
    }else{
        return require(p)
    }
}


var config = global.require('./config/config.js')
var express = global.require('express')
var app = express()
var server = global.require('./websocket.js')(app)
server.listen(config.port,config.host,function(){
    console.log('服务启动成功')
});

global.require('@base/modules/print/index.js').start(app)
global.require('@base/modules/faceDetect/index.js').start(app)
global.require('@base/modules/vueComponent/index.js').start(app)




