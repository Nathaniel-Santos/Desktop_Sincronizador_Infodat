
import { DeleteWebTableData } from './DeleteWebTableData';
import { InsertWebDbTable } from './InsertWebDbTable';

export async function UpdateWebDbTable(connection: any, tableName: string, tableFields: string[], dados: string[]) {

  if(dados.length > 0){
    const deleteResult = await DeleteWebTableData(connection, tableName)
    console.log('DeleteResult: ', deleteResult)

    if (deleteResult.Status === 200) { //Success
      const insertResult = await InsertWebDbTable(connection, tableName, tableFields, dados)
      console.log('InsertResult:', insertResult)

      if (insertResult.Status === 200) { //Success
        return { Status: 200, Msg: 'Success update', Return: insertResult }

      } else {
        return insertResult //Error
      }

    } else { // Error
      return deleteResult
    }

  } else {
    return {Status: 200, Msg: `Mdb não possui dados para essa tabela ${tableName}`}
  }

}
