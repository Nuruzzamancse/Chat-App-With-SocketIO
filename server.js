const express = require('express');
const path = require('path');

const port= 8080;

const app = express();
const server = require('http').createServer(app);

let io = require('socket.io').listen(server);

let users = [];


//View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


//Static Path
app.use(express.static(path.join(__dirname,'public')));

io.sockets.on('connection', (socket) => {

    socket.on('set user',(data,callback)=>{
        if(users.indexOf(data)!=-1){
            callback(false);
        }else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsers();
        }
    })

    socket.on('send message',function (data) {
        io.sockets.emit('show message',{msg:data,user:socket.username});
    })

    socket.on('disconnect',function (data) {
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsers();
    })

    function updateUsers() {
        io.sockets.emit('users' ,users);
    }

})

app.get('/',function (req,res,next) {
    res.render('index');
});

server.listen(port,function () {
    console.log('Server is running on port '+port);
})

