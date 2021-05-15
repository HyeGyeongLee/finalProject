var oracledb = require("oracledb"); //오라클을 사용하겟따.
var config = require("config/database.json").config; //오라클 아이디 정보 뭐 그런곳을 담는곳이라 생각하면 된다.  의존성을 위해 분리시켜놨다.
const { JtoCamel, doRelease } = require("util/");
oracledb.autoCommit = true; //java 와 달리 node 에서는 outocommit이 false 이다 true로 항상 바꾸어 사용하여야 된다.

exports.selectCashJournalList = async (map) => {
  let connection;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      "SELECT CASE " +
        "			WHEN LEV IS NULL THEN '2' " +
        "			ELSE LEV " +
        "       END             AS LEV, " +
        "       MONTH_REPORTING_DATE, " +
        "       CASE " +
        "         WHEN LEV = '1' THEN '[전 일 이 월]' " +
        "         WHEN REPORTING_DATE IS NULL THEN '[월 계]' " +
        "         ELSE REPORTING_DATE " +
        "       END             AS REPORTING_DATE, " +
        "       EXPENSE_REPORT, " +
        "       CUSTOMER_CODE, " +
        "       CUSTOMER_NAME, " +
        "       NVL(SUM(DEPOSIT), 0)    AS DEPOSIT, " +
        "       NVL(SUM(WITHDRAWAL), 0) AS WITHDRAWAL, " +
        "       BALANCE, " +
        "       SLIP_NO " +
        "FROM   (SELECT LEV, " +
        "               MONTH_REPORTING_DATE, " +
        "               REPORTING_DATE, " +
        "               EXPENSE_REPORT, " +
        "               CUSTOMER_CODE, " +
        "               CUSTOMER_NAME, " +
        "               DEPOSIT, " +
        "               WITHDRAWAL, " +
        "               CASE " +
        "					WHEN LEV = '1' " +
        "					THEN DEPOSIT - WITHDRAWAL " +
        "					WHEN LEAD(REPORTING_DATE) OVER(ORDER BY REPORTING_DATE) = REPORTING_DATE " +
        "					THEN NULL " +
        "					ELSE SUM(DEPOSIT) OVER(ORDER BY LEV, MONTH_REPORTING_DATE, SLIP_NO " +
        "							ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) " +
        "						- SUM(WITHDRAWAL) OVER(ORDER BY LEV, MONTH_REPORTING_DATE, SLIP_NO " +
        "							ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) " +
        "               END AS BALANCE, " +
        "               SLIP_NO " +
        "        FROM   (SELECT '2'            AS LEV, " +
        "                       MONTH_REPORTING_DATE, " +
        "                       REPORTING_DATE REPORTING_DATE, " +
        "                       EXPENSE_REPORT, " +
        "                       CUSTOMER_CODE, " +
        "                       CUSTOMER_NAME, " +
        "                       DEPOSIT        AS DEPOSIT, " +
        "                       WITHDRAWAL     AS WITHDRAWAL, " +
        "                       SLIP_NO " +
        "                FROM   (SELECT SUBSTR(S.REPORTING_DATE, 0, 7) AS MONTH_REPORTING_DATE, " +
        "                               S.REPORTING_DATE               AS REPORTING_DATE, " +
        "                               S.EXPENSE_REPORT               AS EXPENSE_REPORT, " +
        "                               J.CUSTOMER_CODE                AS CUSTOMER_CODE, " +
        "                               C.CUSTOMER_NAME                AS CUSTOMER_NAME, " +
        "                               J.LEFT_DEBTOR_PRICE            AS DEPOSIT, " +
        "                               J.RIGHT_CREDITS_PRICE          AS WITHDRAWAL, " +
        "                               S.SLIP_NO                      AS SLIP_NO " +
        "                        FROM   ACCOUNT A, " +
        "                               SLIP S, " +
        "                               JOURNAL J, " +
        "                               CUSTOMER C " +
        "                        WHERE  S.SLIP_NO = J.SLIP_NO " +
        "                               AND J.ACCOUNT_INNER_CODE = A.ACCOUNT_INNER_CODE " +
        "                               AND J.CUSTOMER_CODE = C.CUSTOMER_CODE(+) " +
        "                               AND J.ACCOUNT_INNER_CODE = '0101' " +
        "                               AND S.SLIP_STATUS = '승인' " +
        "                               AND S.REPORTING_DATE BETWEEN :fromDate AND :toDate) " +
        "                UNION ALL " +
        "                SELECT '1'                        AS LEV, " +
        "                       NULL                       AS MONTH_REPORTING_DATE, " +
        "                       NULL                       AS REPORTING_DATE, " +
        "                       NULL                       AS EXPENSE_REPORT, " +
        "                       NULL                       AS CUSTOMER_CODE, " +
        "                       NULL                       AS CUSTOMER_NAME, " +
        "                       SUM(J.LEFT_DEBTOR_PRICE)   AS DEPOSIT, " +
        "                       SUM(J.RIGHT_CREDITS_PRICE) AS WITHDRAWAL, " +
        "                       NULL                       AS SLIP_NO " +
        "                FROM   SLIP S, " +
        "                       JOURNAL J " +
        "                WHERE  S.SLIP_NO = J.SLIP_NO " +
        "                       AND J.ACCOUNT_INNER_CODE = '0101' " +
        "                       AND S.SLIP_STATUS = '승인' " +
        "                       AND S.REPORTING_DATE < :fromDate)) " +
        "GROUP  BY ROLLUP( MONTH_REPORTING_DATE, ( LEV, REPORTING_DATE, EXPENSE_REPORT, " +
        "                                          CUSTOMER_CODE, CUSTOMER_NAME, BALANCE, SLIP_NO ) ) " +
        "HAVING GROUPING(MONTH_REPORTING_DATE) < 1 " +
        "       AND LEV IN( 1, 2 ) " +
        "        OR MONTH_REPORTING_DATE IS NOT NULL " +
        "UNION ALL " +
        "SELECT '3'                        AS LEV, " +
        "       '9999-12'                  AS MONTH_REPORTING_DATE, " +
        "       '[전 체 누 계]'        AS REPORTING_DATE, " +
        "       NULL                       AS EXPENSE_REPORT, " +
        "       NULL                       AS CUSTOMER_CODE, " +
        "       NULL                       AS CUSTOMER_NAME, " +
        "       SUM(J.LEFT_DEBTOR_PRICE)   AS DEPOSIT, " +
        "       SUM(J.RIGHT_CREDITS_PRICE) AS WITHDRAWAL, " +
        "       NULL                       AS BALANCE, " +
        "       NULL                       AS SLIP_NO " +
        "FROM   SLIP S, " +
        "       JOURNAL J " +
        "WHERE  S.SLIP_NO = J.SLIP_NO " +
        "       AND J.ACCOUNT_INNER_CODE = '0101' " +
        "       AND S.SLIP_STATUS = '승인' " +
        "       AND S.REPORTING_DATE <= :toDate " +
        "ORDER  BY LEV, " +
        "          MONTH_REPORTING_DATE, " +
        "          SLIP_NO",
      {
        fromDate: map.fromDate,
        toDate: map.toDate,
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // Json 형태로 넘어오도록 설정
    );

    return JtoCamel(result.rows);
    //return result;
  } catch (err) {
    throw new Error(err.message);
  } finally {
    doRelease(connection);
  }
};
