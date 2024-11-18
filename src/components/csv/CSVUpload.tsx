import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CSVUploadProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
}

export function CSVUpload({ onFileAccepted, isProcessing }: CSVUploadProps) {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 hover:border-[#818FB4]
          ${
            isDragActive
              ? 'border-[#818FB4] bg-[#818FB4]/10'
              : 'border-[#818FB4]/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-[#818FB4] mb-4" />
        <p className="text-[#F5E8C7]">
          {isDragActive
            ? 'Drop the CSV file here...'
            : 'Drag & drop a CSV file here, or click to select'}
        </p>
      </div>

      {isProcessing && (
        <div className="space-y-4">
          <Progress value={66} className="animate-pulse bg-[#435585]" />
          <p className="text-center text-sm text-[#818FB4]">
            Processing your CSV file...
          </p>
        </div>
      )}

    </>
  );
}