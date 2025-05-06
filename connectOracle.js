const oracledb = require('oracledb');

const dbconfig = {
    user: 'USER_TESTE',
    password: 'TESTE',
    connectString: 'localhost:1521/FREEPDB1'
}

//async function run() { faz requisição no bd e fica no aguardo do retorno
async function connectar(){

    let connection = await oracledb.getConnection(dbconfig);

    /*select*/

    let select1 = 'SELECT * FROM CLIENTE';
    let result = await connection.execute(`${select1}`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    console.log(result.rows);
    console.log(result.metaData);

}

connectar()