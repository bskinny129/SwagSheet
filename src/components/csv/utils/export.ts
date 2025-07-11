import Papa from 'papaparse';
import { CSVData } from '../types';

export const exportCSV = async (
  file: File,
  selectedColumns: string[],
  rowLimit: number,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const csvRows: string[] = [];
    let currentRowCount = 0;

    Papa.parse(file, {
      header: true,
      step: (results, parser) => {
        if (currentRowCount >= rowLimit) {
          parser.abort();
          return;
        }
        const row = results.data as Record<string, any>;
        const filteredRow = selectedColumns.reduce(
          (acc, col) => ({ ...acc, [col]: row[col] }),
          {}
        );
        csvRows.push(Papa.unparse([filteredRow], { header: false }));
        currentRowCount++;
        
        if (onProgress) {
          onProgress((currentRowCount / rowLimit) * 100);
        }
      },
      complete: () => {
        const csv = [Papa.unparse([selectedColumns]), ...csvRows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        resolve(blob);
      },
      error: reject,
    });
  });
};

export const downloadCSV = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};