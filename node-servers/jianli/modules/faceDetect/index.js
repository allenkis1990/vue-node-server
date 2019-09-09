/**
 * Created by Allen Liu on 2019/8/1.
 */

var require = global.require
var path = require('path')
var fs = require('fs');
var $http = require('axios')
var utils = require('@base/utils/utils.js')


var actions = {
    start(app){
        this.faceMatch(app)
    },
    getFaceToken(){
        var params = {
            grant_type:'client_credentials',
            client_id:'lzOrvaTAdUoztDMYwyxoraYz',
            client_secret:'f8A5twK7rgsrjGMBBz8jd3DYDOYa5qu4'
        }
        return new Promise(function(resolve,reject){
            $http.post('https://aip.baidubce.com/oauth/2.0/token?grant_type='+params.grant_type+'&client_id='+params.client_id+'&client_secret='+params.client_secret).then(function(data){
                var response = data.data
                //console.log(response);
                if(response.error){
                    resolve({
                        code:'500',
                        message:response.error_description
                    })
                }else{
                    resolve({
                        code:'200',
                        info:response
                    })
                }
            },function(){
                resolve({
                    code:'500',
                    message:'服务调用失败'
                })
            })
        })
    },
    faceMatchRequest(access_token,basePhoto,curPhoto){
        var params = []
        for(let i=0;i<2;i++){
            params.push({
                image_type:'BASE64',
                image:'',
                face_type:'LIVE',
                quality_control:'NONE',
                liveness_control:'NONE'
            })
        }
        params[0].image = basePhoto
        params[1].image = curPhoto
        return new Promise(function(resolve,reject){
            $http.post('https://aip.baidubce.com/rest/2.0/face/v3/match?access_token='+access_token,params).then(function(data){
                var response = data.data
                //console.log(response,123);
                if(response.error_msg==='SUCCESS'){
                    resolve({
                        code:'200',
                        info:response
                    })
                }else{
                    resolve({
                        code:'500',
                        message:response.error_msg
                    })
                }
                resolve({
                    code:'200',
                    info:response
                })
            },function(data){
                //console.log(data,11111);
                resolve({
                    code:'500',
                    message:'服务调用失败'
                })
            })
        })
    },
    faceMatch(app){
        var _this = this
        app.post('/actions/faceMatch',function(req,res){
            _this.getFaceToken().then(function(data){
                if(data.code==='200'){
                    utils.onData(req,function(obj){
                        _this.faceMatchRequest(data.info.access_token,obj.data.basePhoto,obj.data.curPhoto).then(function(requestData){
                            res.send(requestData)
                        })
                    })
                }else{
                    res.send(data)
                }
            })
        })
    }

}
module.exports = actions