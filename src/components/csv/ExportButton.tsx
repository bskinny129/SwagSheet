import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportButtonProps } from './types/index';

export function ExportButton({ onExport, isExporting }: ExportButtonProps) {
  return (
    <Button
      onClick={onExport}
      disabled={isExporting}
      size="lg"
      className="space-x-2 bg-primary-bright text-primary-dark hover:bg-primary-bright/90 py-3 px-10 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </>
      )}
    </Button>
  );
}