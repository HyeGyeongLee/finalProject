var oracledb = require('oracledb'); //오라클을 사용하겟따.
var config = require('config/database.json').config;  //오라클 아이디 정보 뭐 그런곳을 담는곳이라 생각하면 된다.  의존성을 위해 분리시켜놨다.
const { JtoCamel,doRelease } = require('util/');
// const mybatisMapper = require('mybatis-mapper');  //매핑할 마이바티스

oracledb.autoCommit=true; //java 와 달리 node 에서는 outocommit이 false 이다 true로 항상 바꾸어 사용하여야 된다.

// mybatisMapper.createMapper([ './estimateMapper.xml' ]);  //예) xml파일이 D드라이브에 있다면, D:/매퍼.xml
// var format = {language: 'sql', indent: '  '};
// var query = mybatisMapper.getStatement('estimateMapper', 'testBasic', param, format);
// //첫번째는 xml의 name값, 두번째는 해당 xml의 id값, 세번째는 파라미터, 마지막은 포맷이다.

exports.searchEstimate = async (map) => {
    let connection;
    try{
      connection = await oracledb.getConnection(config);
      const result1 = await connection.execute(
        "SELECT * "
        + "FROM   estimate "
        + "WHERE  ( CASE :dateSearchCondition "
        + "           WHEN 'estimateDate' THEN To_date(estimate_date, 'YYYY-MM-DD') "
        + "           WHEN 'effectiveDate' THEN To_date(effective_date, 'YYYY-MM-DD') "
        + "         END ) BETWEEN To_date( :startDate, 'YYYY-MM-DD') AND "
        + "                       To_date( :endDate, 'YYYY-MM-DD')",
        {
            startDate:map.startDate,
            endDate:map.endDate,
            dateSearchCondition:map.dateSearchCondition
        },
        { outFormat: oracledb.OBJECT }// Json 형태로 넘어오도록 설정
      );
        
      return JtoCamel(result2.rows);
    }catch(err){
     throw new Error(err.message);
    } finally {
      doRelease(connection);
    }
}