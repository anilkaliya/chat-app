class Users {
constructor(){
   this.users=[];
}

//function to add user to user array whenever user is created
addUser(id,name,room){
  var user={id,name,room};
  this.users.push(user);
  return user;
  }

  //function to get user by socket id i
getUser(id){

  return  this.users.filter((user)=>user.id===id)[0];
}

//Remove the user by socketid and return the removed user
removeUser(id){
  var user=this.getUser(id);
  if(user){
    this.users=this.users.filter((user)=>user.id!==id)
  }
  return user;
}

//get the list pf users in particular room and return the names of users in array
getUserList(room){
  var users=this.users.filter((user)=>user.room===room);
  var nameArrays=users.map((user)=>user.name);
  return nameArrays;
}

}
module.exports={Users};
