import { readFileSync } from "fs";
import MDBReader from "mdb-reader";


export function GetMdbTableFields(mdbFilePath: string, password: string, tableName){
  const buffer = readFileSync(mdbFilePath);
  const reader = new MDBReader(buffer, {password: password});

  const table = reader.getTable(tableName)
  const tableFields = table.getColumnNames()

  return tableFields
}
