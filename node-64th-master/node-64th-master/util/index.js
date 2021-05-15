const { toCamel } = require('snake-camel'); 

exports.delivery = (response,data) => {
  console.log(data);
  response.json(data);
}

//connection.release 를 이용해서 pool에 connection을 반납하는 function이다
exports.doRelease =async (connection) => {
  await connection.release(function (err) {
    if (err) {  //제대로 반납하지 못하는 경우 error 발생
      console.error(err.message);
    }
  });
}

//객체의 key 값을 소문자로 바꿔준다
//우리가 사용하는 스네이크 형식에서 카멜로 바꾸기 위해 미리 해둬야 되는 작업이다
exports.JtoCamel = (obj) => {
    if(Array.isArray(obj)){
      const arr = obj;
      let list = [];
      let toCamelList = []
      for(let o of arr){
           list.push(Object.keys(o).reduce(function(accum, key) {
            accum[key.toLowerCase()] = o[key];
            return accum;
            }, {}))
      }
      for(let o of list){
        toCamelList.push(toCamel(o))
      }
      return toCamelList;
    }else{
      return toCamel(Object.keys(obj).reduce(function(accum, key) {
        accum[key.toLowerCase()] = obj[key];
        return accum;
      }, {}))
    }   
}


