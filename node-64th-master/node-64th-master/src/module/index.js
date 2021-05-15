//각 업무별 index.js 파일은 spring 에서 UrlHandlerMapping 이라고 생각하면된다
//spring MVC 패턴을 흉내냈다 친숙하게 사용할 수 있다. RestAPI 방법을 사용한다.
/*
                기본 설명
    url : http://localhost:4000/module/function1 으로 접근 했을시 
    1. server/app.js ---------- app.use('/module', require('./src/module')); 실행 
    2. server/src/module/index.js ---------- router.get('/function1', example1Controller.memberList); 실행
    3. ./function1/controller/exampleController.js ---------- memberList() 실행 
    4. Controller -> Service -> DAO -> DB 데이터 리턴
    5. util.js ---------- delivery(response,data) 뷰로 데이터 전송
*/
const express = require('express'); //express 프레임워크
const router = express.Router();    //react Router랑 거의 같은 개념이다.



//기능******************************************************************************
//RestAPI

//컨트롤러 목록//
const example1Controller = require('./function1/controller/exampleController');
//컨트롤러 목록//

//전체조회   *url        *실행할 funtion
router.get('/function1', example1Controller.memberList);

//한명조회     
router.get('/function1/:id', example1Controller.member);

//삭제
router.delete('/function1/:id', example1Controller.destroy);

//추가
router.post('/function1/', example1Controller.create);

//추가하고 조회하는 프로시저
router.post('/function1/:id', example1Controller.procedure);

//한명 업데이트     controller에 update function 을 찾아보자
router.put('/function1/:id', example1Controller.update);
//기능******************************************************************************


module.exports = router;