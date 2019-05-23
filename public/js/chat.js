
var socket=io();

//connect event
socket.on('connect',()=>{
  var params=jQuery.deparam(window.location.search);
socket.emit('join',params,function(err){
if(err) {
alert("user already exists")
      window.location.href='/'
           }

else{
  console.log('no error');
    }
});
});
//disconnect event
socket.on('disconnect',function(){
  console.log('server disconnected');
})


//event listener on userUpdateList event and adding the list of user to the screen using jquery
socket.on('userUpdateList',function(users){
  var ol=jQuery('<ol></ol>');
  users.forEach(function(user)
{
  ol.append(jQuery('<li></li>').text(user));
  jQuery('#users').html(ol);
})

})


//autoscrollimg function which scrolls when new message comes and screen is at bottom
function scrollToBottom(){
  //selectors
  var messages=jQuery('#messages');
  var newmessage=messages.children('li:last-child')

  //heights
  var clientHeight=messages.prop('clientHeight')
  var scrollTop=messages.prop('scrollTop')
  var scrollHeight=messages.prop('scrollHeight')
  var newMessageHeight=newmessage.innerHeight();
  var lastMssageHeight=newmessage.prev().innerHeight();

  if(clientHeight+scrollTop+newMessageHeight+lastMssageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight);
  }

}



//send button functioning
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  var params=jQuery.deparam(window.location.search);
  socket.emit('createMessage',{
text:jQuery('[name=message]').val()},function(){
  jQuery('[name=message]').val('')

});
});

//displaying message using mustache template on browser
socket.on('newmessage', function(message){
var formatedTime=moment(message.createdAt).format('h:mm:ss');
  var template=jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:formatedTime

  });
  jQuery('#messages').append(html);
  scrollToBottom();
})

//displaying location on browser using mustache template
socket.on('newlocationmessage',function(message){
  var formatedTime=moment(message.createdAt).format('h:mm:ss');
    var template=jQuery('#location-message-template').html();
    var html=Mustache.render(template,{
    from:message.from,
      url:message.url,
      createdAt:formatedTime
});
jQuery('#messages').append(html);
scrollToBottom();
})


//event functioning after clcking the send lcation button
var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation)
  {
    return alert("unable to fecth the location");
  }
  locationButton.attr('disabled','disabled').text("Sending location")
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send location')
  socket.emit('currentlocation',{latitude:position.coords.latitude,
  longitude:position.coords.longitude})
  },function(){
        locationButton.removeAttr('disabled').text("Send Location")
    return alert ("unable to get the location");
  })
})
