export interface CSVData {
  columns: string[];
  rows: Record<string, string>[];
  rowCount: number;
  file: File | null;
}

export interface CSVUploadProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  file?: File | null;
  rowCount?: number;
  onChangeFile?: () => void;
  showDropzone: boolean;
}

export interface ExportButtonProps {
  onExport: () => void;
  isExporting: boolean;
}

export interface CSVProcessorState {
  rowLimit: number;
  rowCount: number;
  columns: string[];
  selectedColumns: string[];
  file: File | null;
  isProcessing: boolean;
  isExporting: boolean;
  showDropzone: boolean;
  selectAll: boolean;
}