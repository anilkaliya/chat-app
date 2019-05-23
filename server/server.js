const path=require('path');
var includes = require('array-includes');
const http=require('http');
const SocketIO=require('socket.io');
const express=require('express');
const {isRealString}=require('./utils/validation')
const {generateMessage,generateLocationMessage}=require('./utils/message');
const PublicPath=path.join(__dirname, '/../public/');
const{Users}=require('./utils/users');

//creating new user instance to acess the methods in the user class
var users=new Users();

var app=express();
//creating the server using httpCreateServer
var server=http.createServer(app);
var io=SocketIO(server);


//on connection event fired when server started
io.on('connection',(socket)=>{
  console.log("new user conected");
//event listener after executing join event
  socket.on('join',(params,callback)=>{
    var user=users.getUserList(params.room)
    if(!isRealString(params.name)||!isRealString(params.room))//check if username  and  room name ar string
                                                              //and user with same name not connected already
    {
    return   callback('name and room name are required');
    }
    else if (includes(user,params.name)) {
    return   callback('user already exist please choose different name');
    }

//if validation is true then join room
    socket.join(params.room);
    users.removeUser(socket.id);//remove already connected user and then add the same to usre array
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('userUpdateList',users.getUserList(params.room));//generating msg  to particular room
    socket.emit('newmessage',generateMessage('admin','welcome to group chat'));//emit a admin msg
    socket.broadcast.to(params.room).emit('newmessage',generateMessage('admin',`${params.name} has joined`))
    callback();
})

//event listener for create messsage
socket.on('createMessage',(Message,callback)=>{
var user=users.getUser(socket.id);
if(user && isRealString(Message.text)){
    io.to(user.room).emit('newmessage',generateMessage(user.name,Message.text))   }

callback();
})

//event listener after clicking send location button
  socket.on('currentlocation',(coords)=>{
    var user=users.getUser(socket.id);
    if(user){
//broadcast message to the specific room where user is  connected
  io.to(user.room).emit('newlocationmessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
}
  })



//event listener for disconnect
  socket.on('disconnect',()=>{

    var user=users.removeUser(socket.id);
    if(user)
    {  //event emitter for showing updtaed list of user on page
      //second statement show the message if user left the chat
      io.to(user.room).emit('userUpdateList',users.getUserList(user.room));
      io.to(user.room).emit('newmessage', generateMessage('admin',`${user.name} has left`));
    }
  })
})


//middleware for startpage chat.html
app.use(express.static(PublicPath));

//starting the server
server.listen(3000, ()=>
{
  console.log('server started')
})
