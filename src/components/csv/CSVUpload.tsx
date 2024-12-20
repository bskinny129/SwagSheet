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
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 hover:border-primary-very-light-purple
          ${
            isDragActive
              ? 'border-primary-very-light-purple bg-[#818FB4]/10'
              : 'border-primary-very-light-purple/50'
          }
        `}
      >
        <input {...getInputProps()} className="hidden" />
        <Upload className="mx-auto h-12 w-12 text-[#818FB4] mb-4" />
        <p className="text-gray-600">
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