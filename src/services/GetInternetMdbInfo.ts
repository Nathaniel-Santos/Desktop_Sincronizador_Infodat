import { readFileSync } from "fs";
import MDBReader from "mdb-reader";


export function GetInternetMdbInfo(mdbFilePath: string, password: string){
  const buffer = readFileSync(mdbFilePath);
  const reader = new MDBReader(buffer, {password: password});

  const resultTables = reader.getTableNames();
  console.log('ResultTables: ', resultTables)

  // const tableQualitativas = reader.getTable('Qualitativas')
  // const dadosQualitativas = tableQualitativas.getData()
  // console.log('tableQualitativas: ', tableQualitativas.getData())

  return resultTables
}
