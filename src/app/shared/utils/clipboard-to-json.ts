import { parse } from 'papaparse';

export function clipboardToJson (text: string): any[] {
  const result = parse(text, { delimiter: '\t', skipEmptyLines: true });

  if (result.errors.length) {
    console.warn('clipboard parse error: ', JSON.stringify(result.errors, null, '  '));
  }

  return result.data;
}
