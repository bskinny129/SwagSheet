import { useState } from 'react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

interface CSVData {
  columns: string[];
  rows: Record<string, string>[];
  rowCount: number;
  file: File | null;
}

export function useCSVHandler() {
  const [csvData, setCsvData] = useState<CSVData>({
    columns: [],
    rows: [],
    rowCount: 0,
    file: null,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCSV = (file: File) => {
    setIsProcessing(true);
    setCsvData(prev => ({ ...prev, file }));
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        const columns = results.meta.fields || [];
        
        setCsvData({
          columns,
          rows,
          rowCount: rows.length,
          file,
        });
        
        setIsProcessing(false);
        toast({
          title: 'Success!',
          description: `CSV file processed. Found ${columns.length} columns and ${rows.length} data rows.`,
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