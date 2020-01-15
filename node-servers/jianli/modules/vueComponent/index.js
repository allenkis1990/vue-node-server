/**
 * Created by Allen Liu on 2019/8/1.
 */
var path = global.require('path')
var utils = global.require('@base/utils/utils.js')
var skuList = [
    {
        propertyCode:'year',
        propertyCName:'年度',
        propertyId:'sku1'
    },
    {
        propertyCode:'subject',
        propertyCName:'科目',
        propertyId:'sku2'
    },
    {
        propertyCode:'area',
        propertyCName:'地区',
        propertyId:'sku3'
    }
]
var skuItem = {
    year:[
        {valueName:'2018',value:'skuItem001',valueCode:'2018'},
        {valueName:'2019',value:'skuItem002',valueCode:'2019'},
        {valueName:'2020',value:'skuItem003',valueCode:'2020'}
    ],
    area:[
        {valueName:'福州',value:'skuItem101',valueCode:'fuzhou'},
        {valueName:'厦门',value:'skuItem102',valueCode:'xiamen'},
        {valueName:'泉州',value:'skuItem103',valueCode:'quanzhou'}
    ],
    subject:[
        {valueName:'语文',value:'skuItem301',valueCode:'yuwen'},
        {valueName:'数学',value:'skuItem302',valueCode:'shuxue'},
        {valueName:'英文',value:'skuItem303',valueCode:'yingyu'}
    ]
}
let shoppingCartList = [
    {
        name: 'Allen体育用品店',
        id:'ty',
        subList: [
            {
                parentId:'ty',
                id:'zuqiu',
                name: '足球',
                price:80
            },
            {
                parentId:'ty',
                id:'paobuxie',
                name: '跑步鞋',
                price:190
            },
            {
                parentId:'ty',
                id:'yongjing',
                name: '泳镜',
                price:25
            }
        ]
    },
    {
        name: 'Allen水果店',
        id:'sg',
        subList: [
            {
                parentId:'sg',
                id:'apple',
                name: '苹果',
                price:4
            },
            {
                parentId:'sg',
                id:'xigua',
                name: '西瓜',
                price:10
            },
            {
                parentId:'sg',
                id:'smt',
                name: '水蜜桃',
                price:3
            }
        ]
    },
    {
        name: 'Allen手机专卖店',
        id:'sj',
        subList: [
            {
                parentId:'sj',
                id:'huawei',
                name: '华为',
                price:2999
            },
            {
                parentId:'sj',
                id:'nokia',
                name: '诺基亚',
                price:888
            },
            {
                parentId:'sj',
                id:'htc',
                name: 'H.T.C',
                price:1777
            }
        ]
    }
]
var actions = {
    start(app){
        this.getShoppingCartList(app)
        this.getSkuItemArr(app)
        this.getSkuDetail(app)
    },
    getShoppingCartList(app){
        app.get('/actions/getShoppingCartList', function (req, res) {
            res.send({
                status: true,
                code: 200,
                info: shoppingCartList
            })
        })
    },
    getSkuItemArr(app){
        app.post('/actions/getSkuItemArr',function(req,res){
            utils.onData(req,function(obj){
                let data = obj.data
                // console.log(data);
                let ressult = ''
                for(let key in data){
                    let value = data[key]
                    if(skuItem.hasOwnProperty(value)){
                        ressult = skuItem[value]
                    }
                }
                if(ressult){
                    res.send({
                        status:true,
                        code:200,
                        info:ressult
                    })
                }else{
                    res.send({
                        status:false,
                        code:500,
                        info:'skuItemArr获取失败'
                    })
                }
            })
        })
    },
    getSkuDetail(app){
        app.get('/actions/getSkuDetail',function(req,res){
            res.send({
                status:true,
                code:200,
                info:skuList
            })
        })
    }
}
module.exports = actions