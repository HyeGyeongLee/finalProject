var oracledb = require('oracledb'); //오라클을 사용하겟따.
var config = require('config/database.json').config;  //오라클 아이디 정보 뭐 그런곳을 담는곳이라 생각하면 된다.  의존성을 위해 분리시켜놨다.
const { JtoCamel,doRelease } = require('util/');

oracledb.autoCommit=true; //java 와 달리 node 에서는 outocommit이 false 이다 true로 항상 바꾸어 사용하여야 된다.



exports.getTotalEmpInfo =async (loginTo) => {
    
    let connection;
    try{
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(
        "SELECT EMP_CODE, COMPANY_CODE, EMP_NAME, EMP_ENG_NAME, HIRE_DATE, RETIREMENT_DATE,\r\n" + 
	"        USER_OR_NOT, SOCIAL_SECURITY_NUMBER, BIRTH_DATE, GENDER, SEQ, UPDATE_HISTORY, UPDATE_DATE, \r\n" + 
	"        USER_ID, WORKPLACE_CODE, WORKPLACE_NAME, DEPT_CODE, PHONE_NUMBER, EMAIL, ZIP_CODE, \r\n" + 
	"        BASIC_ADDRESS, DETAIL_ADDRESS, LEVEL_OF_EDUCATION, IMAGE, POSITION_CODE, \r\n" + 
	"        POSITION_NAME, DEPT_NAME,AUTHORITY_CODE\r\n" + 
	"    FROM\r\n" + 
	"    ( SELECT E1.EMP_CODE, E1.COMPANY_CODE, E1.EMP_NAME, E1.EMP_ENG_NAME, E1.HIRE_DATE, E1.RETIREMENT_DATE, \r\n" + 
	"            E1.USER_OR_NOT, E1.SOCIAL_SECURITY_NUMBER, E1.BIRTH_DATE, E1.GENDER, \r\n" + 
	"        E2.SEQ, E2.UPDATE_HISTORY, E2.UPDATE_DATE, E2.USER_ID, E2.WORKPLACE_CODE, W.WORKPLACE_NAME,\r\n" + 
	"        E2.DEPT_CODE, E2.PHONE_NUMBER, E2.ZIP_CODE, E2.BASIC_ADDRESS, E2.DETAIL_ADDRESS,\r\n" + 
	"        E2.LEVEL_OF_EDUCATION, E2.IMAGE, E2.POSITION_CODE, E2.EMAIL,E2.AUTHORITY_CODE,\r\n" + 
	"        P.POSITION_NAME, D.DEPT_NAME\r\n" + 
	"        FROM EMPLOYEE_BASIC E1, EMPLOYEE_DETAIL E2, WORKPLACE W, POSITION P, DEPARTMENT D\r\n" + 
	"        WHERE E1.EMP_CODE = E2.EMP_CODE \r\n" + 
	"            AND E1.COMPANY_CODE = W.COMPANY_CODE \r\n" + 
	"            AND E2.WORKPLACE_CODE = W.WORKPLACE_CODE\r\n" + 
	"            AND E2.WORKPLACE_CODE = P.WORKPLACE_CODE \r\n" + 
	"            AND E2.DEPT_CODE = P.DEPT_CODE \r\n" + 
	"            AND E2.POSITION_CODE = P.POSITION_CODE\r\n" + 
	"            AND E2.WORKPLACE_CODE = D.WORKPLACE_CODE \r\n" + 
	"            AND E2.DEPT_CODE = D.DEPT_CODE\r\n" + 
	"            AND ( E2.EMP_CODE, E2.SEQ ) IN \r\n" + 
	"                ( SELECT EMP_CODE, MAX(SEQ) FROM EMPLOYEE_DETAIL GROUP BY EMP_CODE ) )\r\n" + 
	"    WHERE COMPANY_CODE = :companyCode \r\n" + 
	"        AND WORKPLACE_CODE = :workplaceCode \r\n" + 
	"        AND USER_ID = :empCode",
        {
            companyCode:loginTo.companyCode,
            workplaceCode:loginTo.workplaceCode,
            empCode:loginTo.empCode,
        },
        { outFormat: oracledb.OBJECT }// Json 형태로 넘어오도록 설정
      );
      return JtoCamel(result.rows[0]);
    }catch(err){
      throw new Error('입력된 정보에 해당하는 사원은 없습니다.');
    } finally {
      doRelease(connection);
    }
  }