const sampleService = require('../service/exampleService');
const { delivery } = require('util/');
let data;
exports.memberList = async (request, response) => {
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.memberList()
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {

        delivery(response, data);
    }
}

exports.member = async (request, response) => {
    const memberId = request.params.id;
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.member(memberId)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }
}

exports.destroy = async (request, response) => {
    const memberId = request.params.id;
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.destroy(memberId)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }
}

exports.create = async (request, response) => {
    const member = {
        "id": request.body.id,
        "pw": request.body.pw,
        "addr": request.body.addr,
        "tel": request.body.tel
    }
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.create(member)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }
}

exports.update = async (request, response) => {
    //get 방식으로 접근한것은 request.params 로 받을 수 있다.
    //post,delete,put 으로 전송한 데이터들은 request.body 안에 담겨 사용 할 수 있다


    //if json 으로 받을때
    const member = JSON.parse(request.body.memberJson);
    //else
    /*
    const member = {
        "id": request.params.id,
        "pw": request.body.pw,
        "addr": request.body.addr,
        "tel": request.body.tel
    }
    */
    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.update(member)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }
}

exports.procedure = async (request, response) => {

    const member = {
        "id": request.params.id,
        "pw": request.body.pw,
        "addr": request.body.addr,
        "tel": request.body.tel
    }

    try {
        data = {
            errorMsg: "success",
            errorCode: 0,
            "empInfo": await sampleService.procedure(member)
        }
    } catch (err) {
        data = {
            errorCode: -1,
            errorMsg: err.message
        }
    } finally {
        delivery(response, data);
    }
}

