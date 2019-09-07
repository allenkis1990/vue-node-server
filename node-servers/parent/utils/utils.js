/**
 * Created by Allen Liu on 2019/9/6.
 */
var formdata = require('formidable');
var mineType = require('mime-types');
var fs = require('fs');
module.exports = {
    onData(req,cb) {
        var form = new formdata.IncomingForm();
        var obj = {
            files:{},
            data:{}
        }
        form.on('field', function (name, value) {
            obj.data[name] = value;//这里提取的是键值对数据
        }).on('file', function (name, file) {
            obj.files[name] = file;//这里提取上传的文件
        }).on('end', function () {
            cb(obj)
        });
        form.parse(req);
    },
    getFileBase64(filePath,mt){
        let data = fs.readFileSync(filePath);
        data = new Buffer(data).toString('base64');
        let base64 = 'data:' + (mt?mt:mineType.lookup(filePath)) + ';base64,' + data;
        return base64
    }
}