const oracledb = require('oracledb');
//connection 정리 function
const { JtoCamel, doRelease } = require('util/');
//오라클 설정 객체
const config = {
  "user": "scott",
  "password": "tiger",
  "connectString": "localhost/xe"
}
oracledb.autoCommit = true; //java 와 달리 node 에서는 outocommit이 false 이다 true로 항상 바꾸어 사용하여야 된다.


async function resultSet(result) {
  let resultSetRows = [];
  let resultSet;
  while (resultSet = await result.outBinds.cursor.getRow()) {
    resultSetRows.push(resultSet)
  }
  return resultSetRows
}

exports.memberList = async () => {
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(    //쿼리문 실행 한 결과를 result에담는데 java에서도 같은 개념이다.
      "SELECT * FROM MEMBER ORDER BY ID",
      {},
      { outFormat: oracledb.OBJECT }
    );
    return JtoCamel(result.rows)
  } catch (err) {  //오라클에서 에러를 보내거나 커넥션을 못가지고 오는 경우 catch로 빠짐
    throw new Error(err.message);
  } finally {   //사용한 커넥션 반납
    doRelease(connection);
  }

}

exports.member = async (memberId) => {
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "select * from member where id=:id",
      [memberId],
      { outFormat: oracledb.OBJECT }
    );
    return JtoCamel(result.rows);
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }
}

exports.destroy = async (memberId) => {
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "delete from member where id=:ID",
      [memberId]
    );
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }
}

exports.create = async (memberBean) => {

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "insert into member values(:ID,:PW,:ADDR,:TEL)",
      [memberBean.id, memberBean.pw, memberBean.addr, memberBean.tel]
    );
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }

}
exports.update = async (memberBean) => {
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "UPDATE member SET pw=:pw, addr=:addr, tel=:tel where id=:id",
      [memberBean.pw, memberBean.addr, memberBean.tel, memberBean.id]
    );
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }
}
exports.procedure = async (memberBean) => {
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "call P_INSERT_MEMBER(:id,:pw,:addr,:tel,:errorCode,:errorMsg,:cursor)",
      {  // bind variables
        id: memberBean.id,
        pw: memberBean.pw,
        addr: memberBean.addr,
        tel: memberBean.tel,
        errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        errorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OBJECT }
    );
    //프로시저를 사용할때는 약간 방법이 바뀐다 그냥 조회 할때는 간단하게 result 에서 rows 로 값을 바로 편하게 받을 수 있지만 
    //프로시저에서는 java 에서처럼 rs.next() 를 while 문으로 돌려주는것 처럼 해주어야 된다. 
    //그걸 담당하는 function이 resultSet() 이다 이름이 별로면 바로 바로 말해주면 좋겠다 안에는 어떻게 생겼는지 알필요 없고 
    //result를 넣어주면 result.rows 처럼 값을 [{id:'id1',tel:'id1',addr:'id1',tel:'id1'}] 형식으로 반환해준다  비동기다 await 붙어있는 모든것이 비동기처리이다
    //꼭 해주어야된다.

    return await JtoCamel(await resultSet(result));;
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }

}


