import Papa from 'papaparse';
import { CSVData } from '../types';

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    let rows: Record<string, string>[] = [];
    let headers: string[] = [];

    Papa.parse(file, {
      header: true,
      step: (results) => {
        if (rows.length === 0) {
          headers = Object.keys(results.data as object);
        }
        rows.push(results.data as Record<string, string>);
      },
      complete: () => {
        resolve({
          columns: headers,
          rows: rows.slice(0, -1), // Remove last empty row
          rowCount: rows.length - 1,
          file,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const exportToCSV = (data: Record<string, string>[], columns: string[]): string => {
  return Papa.unparse({
    fields: columns,
    data: data,
  });
};