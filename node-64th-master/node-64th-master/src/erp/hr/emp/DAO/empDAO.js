var oracledb = require('oracledb'); //오라클을 사용하겟따.
var config = require('config/database.json').config;  //오라클 아이디 정보 뭐 그런곳을 담는곳이라 생각하면 된다.  의존성을 위해 분리시켜놨다.
const { JtoCamel,doRelease } = require('util/');
oracledb.autoCommit=true; //java 와 달리 node 에서는 outocommit이 false 이다 true로 항상 바꾸어 사용하여야 된다.



exports.selectEmpList = async () => {
    let connection;
    try{
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        "	SELECT*FROM(\r\n" + 
        "    SELECT D.DEPT_NAME, B.EMP_NAME,P.POSITION_NAME,B.EMP_CODE FROM DEPARTMENT D, EMPLOYEE_BASIC B, EMPLOYEE_DETAIL E, POSITION P\r\n" +
        "          WHERE D.DEPT_CODE=B.DEPT_CODE \r\n" +
        "          AND B.EMP_CODE=E.EMP_CODE\r\n" +
        "          AND E.POSITION_CODE=P.POSITION_CODE\r\n" +
        "      ORDER BY B.EMP_NAME)\r\n" +
        "    GROUP BY DEPT_NAME,	EMP_NAME,POSITION_NAME,EMP_CODE \r\n" +
        "  ORDER BY DEPT_NAME",
        [],
        { outFormat: oracledb.OBJECT }// Json 형태로 넘어오도록 설정
      );     
      console.log("왜 안나오냐ㅠ",result.rows);
      return JtoCamel(result.rows);
      
    }catch(err){
     throw new Error(err.message);
    } finally {
      doRelease(connection);
    }
}




exports.selectEmpListD = async (deptName) => {
    let connection;
    try{
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        "		SELECT*FROM( \r\n" + 
        "    SELECT D.DEPT_NAME,  \r\n" + 
        "                  B.EMP_NAME, \r\n" + 
        "          P.POSITION_NAME, \r\n" + 
        "          B.EMP_CODE \r\n" + 
        "          FROM DEPARTMENT D, EMPLOYEE_BASIC B, EMPLOYEE_DETAIL E, POSITION P \r\n" + 
        "          WHERE D.DEPT_CODE=B.DEPT_CODE \r\n" + 
        "          AND B.EMP_CODE=E.EMP_CODE \r\n" + 
        "          AND E.POSITION_CODE=P.POSITION_CODE \r\n" + 
        "          AND D.DEPT_CODE= :deptName  \r\n" + 
        "          ORDER BY B.EMP_NAME) \r\n" + 
        "  GROUP BY DEPT_NAME,	EMP_NAME,POSITION_NAME,EMP_CODE",
        [deptName],
        { outFormat: oracledb.OBJECT }// Json 형태로 넘어오도록 설정
      );     
      
      return JtoCamel(result.rows);
      
    }catch(err){
     throw new Error(err.message);
    } finally {
      doRelease(connection);
    }
}





exports.selectEmpListN = async (deptName) => {
    let connection;
    try{
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        "		SELECT*FROM( \r\n" + 
        "    SELECT D.DEPT_NAME,  \r\n" + 
        "                  B.EMP_NAME, \r\n" + 
        "          P.POSITION_NAME, \r\n" + 
        "          B.EMP_CODE \r\n" + 
        "          FROM DEPARTMENT D, EMPLOYEE_BASIC B, EMPLOYEE_DETAIL E, POSITION P \r\n" + 
        "          WHERE D.DEPT_CODE=B.DEPT_CODE \r\n" + 
        "          AND B.EMP_CODE=E.EMP_CODE \r\n" + 
        "          AND E.POSITION_CODE=P.POSITION_CODE \r\n" + 
        "          AND B.EMP_NAME=:deptName \r\n" + 
        "          ORDER BY B.EMP_NAME) \r\n" + 
        "  GROUP BY DEPT_NAME,	EMP_NAME,POSITION_NAME,EMP_CODE",
        [deptName],
        { outFormat: oracledb.OBJECT }// Json 형태로 넘어오도록 설정
      );     
      
      return JtoCamel(result.rows);
      
    }catch(err){
     throw new Error(err.message);
    } finally {
      doRelease(connection);
    }
}