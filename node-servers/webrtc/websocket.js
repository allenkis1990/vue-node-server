/**
 * Created by AllenLiu on 2019/7/29.
 */
var http=require('http');

function wbStart(app){
    var server=http.createServer(app);
    let socketIo = require('socket.io')
    let io = socketIo.listen(server)
    let userCount = 0
    let canUsedRoom = ['921']
    let roomInfos = []
    io.sockets.on('connection',(socket)=>{

        socket.on('disconnect',()=>{
            // console.log('disconnect');
            leaveRoom(socket,socket.isAnchor)
        })

        socket.on('join',(obj)=>{
            let roomNum = obj.roomNum,
                nickName = obj.nickName,
                isAnchor = obj.isAnchor
            //房间号未开放的
            if(canUsedRoom.indexOf(roomNum)<0){
                socket.emit('reject')
                return
            }

            let hasExist = roomInfos.findIndex((item)=>{
                return item.roomNum === roomNum && item.nickName === nickName
            })

            if(hasExist>-1){
                socket.emit('hasExist')
                return
            }



            socket.join(roomNum)//加入房间API
            socket.nickName = nickName
            socket.roomNum = roomNum
            socket.isAnchor = isAnchor
            roomInfos.push({
                roomNum:roomNum,
                nickName:nickName,
                socket:socket
            })
            // console.log(roomInfos,33);
            socket.emit('joined',{
                roomNum:roomNum,
                nickName:nickName,
                isAnchor:socket.isAnchor,
                roomInfos:roomInfos.map((item)=>{
                    return {
                        roomNum:item.roomNum,
                        nickName:item.nickName
                    }
                })
            })//自己加入

            socket.to(roomNum).emit('otherJoined',{
                roomNum:roomNum,
                nickName:nickName,
                isAnchor:socket.isAnchor,
                roomInfos:roomInfos.map((item)=>{
                    return {
                        roomNum:item.roomNum,
                        nickName:item.nickName
                    }
                })
            })//其他人加入

            let myRoom = io.sockets.adapter.rooms[roomNum]//某个房间的房间对象
            // userCount = Object.keys(myRoom.sockets).length//某个房间内有多少人
            // io.in(room).emit('userCount',userCount)
            // console.log(myRoom);


        })


        socket.on('sendToSomeOne',(obj)=>{
            // console.log(obj);
            socket.broadcast.emit('sendToSomeOne',obj)
        })

        socket.on('sendToEveryOne',(obj)=>{
            // console.log(obj);
            socket.broadcast.emit('sendToEveryOne',obj)
        })


        function leaveRoom(obj,isAnchor){
            let roomNum = obj.roomNum,
                nickName = obj.nickName

            roomInfos = roomInfos.filter((item)=>{
                return (item.roomNum === obj.roomNum) && item.nickName!==obj.nickName
            })

            socket.emit('leave',{
                roomNum:roomNum,
                nickName:nickName,
                isAnchor:isAnchor,
                roomInfos:roomInfos.map((item)=>{
                    return {
                        roomNum:item.roomNum,
                        nickName:item.nickName
                    }
                })
            })//自己离开

            socket.to(roomNum).emit('otherLeaved',{
                roomNum:roomNum,
                nickName:nickName,
                isAnchor:isAnchor,
                roomInfos:roomInfos.map((item)=>{
                    return {
                        roomNum:item.roomNum,
                        nickName:item.nickName
                    }
                })
            })//其他人离开

            // userCount --
            // io.in(room).emit('userCount',userCount)
            socket.leave(roomNum)//离开接口要放在最后调用  离开房间API
        }

        socket.on('leave',(obj)=>{
            leaveRoom(obj,socket.isAnchor)
        })

    })



    return server
}


module.exports = wbStart


