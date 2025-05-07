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
    //console.log(result.metaData);

}

async function insert() {
    let connection;
  
    try {
      connection = await oracledb.getConnection(dbconfig);
  
      // SQL de inserção com retorno do ID
      const insertSQL = `
        INSERT INTO CLIENTE (NOME, CONTATO, CADASTRO)
        VALUES (:NOME, :CONTATO, :CADASTRO)
        RETURNING ID INTO :ID
      `;
  
      // Dados a serem inseridos
      const binds = {
        NOME: 'Odair2',
        CONTATO: 'LUCAR@EMAIL.COM',
        CADASTRO: new Date('2025-05-06'),
        ID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      };
  
      const options = { autoCommit: true };
  
      // Executa o insert
      const resultInsert = await connection.execute(insertSQL, binds, options);
      const novoId = resultInsert.outBinds.ID[0];
  
      // Consulta o registro recém-inserido
      const resultSelect = await connection.execute(
        `SELECT * FROM CLIENTE WHERE ID = :id`,
        [novoId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      await connection.commit();//força commit para salvar em banco do registro
  
      console.log('✅ Registro inserido com sucesso:');
      console.log(resultSelect.rows[0]);
  
    } catch (err) {
      console.error('❌ Erro ao inserir no banco de dados:');
      console.error(err.message || err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeErr) {
          console.error('⚠️ Erro ao fechar a conexão:', closeErr.message || closeErr);
        }
      }
    }
  }

async function update() {
    let connection;  
    try {
      connection = await oracledb.getConnection(dbconfig);
  
      // SQL de atualização
      const updateSQL = `
        UPDATE CLIENTE
        SET NOME = :NOME, CONTATO = :CONTATO, CADASTRO = :CADASTRO
        WHERE ID = :ID
      `;
  
      // Dados a serem atualizados
      const binds = {
        NOME: 'Odair2',
        CONTATO: 'odair@email.com',
        CADASTRO: new Date('2025-05-06'),
        ID: 28 // ID do registro a ser atualizado
      };

      const options = { autoCommit: true };
      const result = await connection.execute(updateSQL, binds, options);

      if (result.rowsAffected === 0) {
        console.log(`⚠️ Nenhum registro encontrado com ID: ${binds.ID}`);
      } else {
        console.log(`✅ Registro atualizado com sucesso (ID: ${binds.ID})`);
      }

    }catch (err) {
      console.error('❌ Erro ao atualizar o registro:');
      console.error(err.message || err);
    }
}


async function DELETE(idParaExcluir) {
    let connection;  
    try {
      connection = await oracledb.getConnection(dbconfig);
  
      // SQL de exclusão
      const deleteSQL = `DELETE FROM CLIENTE WHERE ID = :ID `;
      const result = await connection.execute(
        deleteSQL,
        { ID: idParaExcluir },
        { autoCommit: true }
      );
  
      
  
      if (result.rowsAffected === 0) {
        console.log(`⚠️ Nenhum registro encontrado com ID: ${idParaExcluir}`);
      } else {
        console.log(`✅ Registro excluído com sucesso: ${idParaExcluir}`);
      }

    } catch (err) {
      console.error('❌ Erro ao excluir o registro:');
      console.error(err.message || err);
    }
}

function main() {
    //connectar()
    //insert();
    update();
    //DELETE(25);
}

main()

