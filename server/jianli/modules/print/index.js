/**
 * Created by Allen Liu on 2019/8/1.
 */
var path = global.require('path')
var htmlPdf = global.require('html-pdf')
var template = global.require('art-template')
var tempPath = path.resolve(__dirname,'../../temp/print.html')
var fs = global.require('fs');
var fileDataBase = '../../fileDataBase'
var utils = global.require('@base/utils/utils.js')


var actions = {
    start(app){
        this.print(app)
        this.previewPdf(app)
    },
    print(app){
        app.post('/actions/print',function(req,res){
            var headers = req.headers
            if(headers.referer.indexOf(headers.origin)<=-1){
                res.send({code:'500',message:'来自外部链接的操作',pdfPath:null})
            }
            // console.log(req);
            utils.onData(req,function(obj){
                // console.log(obj.data);
                // console.log(JSON.stringify(obj.files.imgPath));
                var imgBase64
                try {
                    imgBase64 = utils.getFileBase64(obj.files.imgPath.path, obj.files.imgPath.type)
                }catch(e){
                    if(e){
                        console.log('没找到上传的文件')
                        res.send({code: '500', message: '没找到上传的文件', pdfPath: null})
                    }
                }
                var userInfo = Object.assign({imgBase64:imgBase64},obj.data)

                var tempStr = template(tempPath,{userInfo})

                var pdfDestPath = decodeURI(userInfo.userName+'.pdf')
                // console.log(pdfDestPath,'pdfDestPath');
                htmlPdf.create(tempStr, {}).toFile(path.resolve(__dirname,fileDataBase,pdfDestPath), function (err, r) {
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log('生成pdf成功');
                    res.send({code:'200',message:'生成pdf成功',pdfPath:pdfDestPath})
                });
            })
        })
    },
    previewPdf(app){
        app.get('/preview/pdf/*',function(req,res){
            // console.log(req.url);
            var pathArr = req.url.split('/')
            var fileName =decodeURI(pathArr[pathArr.length-1])
            // console.log(fileName,'fileName');
            fs.readFile(path.resolve(__dirname,fileDataBase,fileName),function(err,data){
                res.setHeader('Content-Type', 'application/pdf')
                res.send(data)
            })
        })
    }

}
module.exports = actions