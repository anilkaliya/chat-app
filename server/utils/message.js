
var date=require('moment');
var generateMessage=(from ,text)=>{
  return {from,
  text,
createdAt:date.valueOf()}
};

var generateLocationMessage=(from,latitude,longitude)=>{
  return {from,
  url:`https://www.google.com/maps?q=${latitude},${longitude}`,
createdAt:date.valueOf()}
}
module.exports={generateMessage,generateLocationMessage};
