import { parse } from 'papaparse';

export async function csvToJson (file: File): Promise<any[]> {
  return new Promise<any[]>(async (resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        if (results.errors.length) {
          console.warn('CSV parse error: ', JSON.stringify(results.errors, null, '  '));
        }
        resolve(results.data);
      },
      error: error => reject(error)
    });
  });
}
