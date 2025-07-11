import { useState } from 'react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { CSVProcessorState } from '../types/index';

export function useCSVProcessor() {
  const [state, setState] = useState<CSVProcessorState>({
    rowLimit: 1000,
    rowCount: 0,
    columns: [],
    selectedColumns: [],
    file: null,
    isProcessing: false,
    isExporting: false,
    showDropzone: true,
    selectAll: true,
  });

  const { toast } = useToast();

  const setPartialState = (newState: Partial<CSVProcessorState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleSelectAll = (checked: boolean) => {
    setPartialState({
      selectAll: checked,
      selectedColumns: checked ? state.columns : [],
    });
  };

  const handleFileAccepted = (file: File) => {
    setPartialState({
      isProcessing: false,
      showDropzone: false,
      selectAll: true,
    });
    processCSV(file);
  };

  const onColumnsReorder = (reorderedColumns: string[]) => {
    setPartialState({ columns: reorderedColumns });
  };

  const onColumnToggle = (column: string) => {
    const newSelection = state.selectedColumns.includes(column)
      ? state.selectedColumns.filter(c => c !== column)
      : [...state.selectedColumns, column];
    
    setPartialState({
      selectedColumns: newSelection,
      selectAll: newSelection.length === state.columns.length,
    });
  };

  const processCSV = (file: File) => {
    setPartialState({ file, isProcessing: true });
    let rowCount = 0;
    let headers: string[] = [];

    Papa.parse(file, {
      header: true,
      step: (results) => {
        if (rowCount === 0) {
          headers = Object.keys(results.data as object);
          setPartialState({
            columns: headers,
            selectedColumns: headers,
          });
        }
        rowCount++;
      },
      complete: () => {
        const finalRowCount = Math.max(rowCount - 1, 1);
        setPartialState({
          rowLimit: finalRowCount,
          rowCount: finalRowCount,
          isProcessing: false,
        });
        toast({
          title: 'Success!',
          description: `CSV file processed. Found ${headers.length} columns and ${finalRowCount} data rows.`,
        });
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setPartialState({ isProcessing: false });
      },
    });
  };

  return {
    state,
    setPartialState,
    handleSelectAll,
    handleFileAccepted,
    onColumnsReorder,
    onColumnToggle,
    processCSV,
  };
}