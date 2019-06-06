import * as XLSX from 'xlsx';

export async function excelToJson (file: File): Promise<{}[]> {
  return new Promise<{}[]>(async (resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = (e) => {
      reject(reader.error);
    };

    reader.onload = (e: any) => {
      /* read workbook */
      const wb: XLSX.WorkBook = XLSX.read(reader.result, { type: 'binary', cellDates: true,  });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, { raw: true });

      resolve(data);
    };
    reader.readAsBinaryString(file);
  });
}
