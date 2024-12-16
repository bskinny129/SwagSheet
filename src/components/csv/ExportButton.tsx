import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data: Record<string, string>[];
  columns: string[];
  disabled?: boolean;
}

export function ExportButton({ data, columns, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csv = Papa.unparse({
        fields: columns,
        data: data,
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'Your CSV file has been processed and downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred during export',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
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