import { useState } from 'react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

export interface CSVData {
  columns: string[];
  rows: Record<string, string>[];
  rowCount: number;
  file: File | null;
}

export function useCSVHandler() {
  const [csvData, setCSVData] = useState<CSVData>({
    columns: [],
    rows: [],
    rowCount: 0,
    file: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCSV = (file: File) => {
    setIsProcessing(true);
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
        setCSVData({
          columns: headers,
          rows: rows.slice(0, -1), // Remove last empty row
          rowCount: rows.length - 1,
          file,
        });
        setIsProcessing(false);
        toast({
          title: 'Success!',
          description: `CSV file processed. Found ${headers.length} columns and ${rows.length - 1} data rows.`,
        });
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsProcessing(false);
      },
    });
  };

  return {
    csvData,
    isProcessing,
    processCSV,
  };
}