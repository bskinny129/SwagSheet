import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, Loader2, Wand2 } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ColumnManager } from './ColumnManager';
import { PaymentModal } from './PaymentModal';
import { CSVUpload } from './CSVUpload';

interface CSVData {
  [key: string]: string;
}

export function CSVProcessor() {
  const [rowLimit, setRowLimit] = useState(1000);
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CSVData[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);

  const { toast } = useToast();


  // Previous functions remain the same until enhanceWithAI
  const handleFileAccepted = (file: File) => {
    setIsProcessing(false);
    setShowDropzone(false);
    processCSV(file);
  }

  const onColumnsReorder = (reorderedColumns: string[]) => {
    setColumns(reorderedColumns);
  };

  const onColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };


  const processCSV = (file: File) => {
    setFile(file);
    setIsProcessing(true);
    let rowCount = 0;
    let headers: string[] = [];
    console.log('Starting CSV processing');
    Papa.parse(file, {
      //preview: 1, // Only parse the first row to get headers
      step: (results, parser) => {
        if (rowCount === 0) {
          // Extract headers from the first row
          headers = Object.keys(results.data as object);
          setColumns(headers);
          setSelectedColumns(headers);
        }
        rowCount++;
        //console.log(`Processed row ${rowCount}`);
      },
      complete: () => {
        setRowLimit(Math.max(rowCount - 1, 1));
        setRowCount(rowCount-1);
        setIsProcessing(false);
        toast({
          title: 'Success!',
          description: `CSV file processed. Found ${headers.length} columns and ${rowCount - 1} data rows.`,
        });
      },
      header: true,
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

  const exportFilteredCSV = async () => {
    try {
      setIsExporting(true);
      
      const orderedColumns = columns.filter(col => selectedColumns.includes(col));
      const filteredData = data
        .slice(0, rowLimit)
        .map((row) =>
          orderedColumns.reduce((acc, col) => ({ ...acc, [col]: row[col] }), {})
        );

      const csv = Papa.unparse(filteredData);
      const filename = `export-${Date.now()}.csv`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('csv-exports')
        .upload(filename, csv, {
          contentType: 'text/csv',
          cacheControl: '3600',
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('csv-exports')
        .getPublicUrl(filename);

      const link = document.createElement('a');
      link.href = urlData.publicUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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

  const enhanceWithAI = async () => {
    try {
      setIsEnhancing(true);
      
      // First export the current CSV to storage
      const orderedColumns = columns.filter(col => selectedColumns.includes(col));
      const filteredData = data
        .slice(0, rowLimit)
        .map((row) =>
          orderedColumns.reduce((acc, col) => ({ ...acc, [col]: row[col] }), {})
        );

      const csv = Papa.unparse(filteredData);
      const filename = `pre-enhance-${Date.now()}.csv`;
      
      // Upload original CSV
      const { data: storageData, error: storageError } = await supabase.storage
        .from('csv-exports')
        .upload(filename, csv, {
          contentType: 'text/csv',
          cacheControl: '3600',
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('csv-exports')
        .getPublicUrl(filename);

      // Call the Edge Function
      const { data: processedData, error: functionError } = await supabase.functions
        .invoke('ProcessCSV', {
          body: { fileUrl: urlData.publicUrl },
        });

      if (functionError) throw functionError;

      // Download the enhanced CSV
      const response = await fetch(processedData.url);
      const enhancedCsv = await response.text();
      
      // Parse the enhanced CSV and update the UI
      Papa.parse(enhancedCsv, {
        complete: (results) => {
          const headers = results.meta.fields || [];
          setColumns(headers);
          setSelectedColumns(headers);
          setData(results.data as CSVData[]);
          toast({
            title: 'Enhancement complete',
            description: 'Your CSV has been processed with AI enhancement',
          });
        },
        header: true,
      });

    } catch (error) {
      toast({
        title: 'Enhancement failed',
        description: error instanceof Error ? error.message : 'An error occurred during AI processing',
        variant: 'destructive',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleEnhanceClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    enhanceWithAI();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F5E8C7] mb-2">CSV Processor</h1>
        <p className="text-[#818FB4]">Upload, process, and export your CSV files</p>
      </div>

      {showDropzone ? (
        <CSVUpload 
          onFileAccepted={handleFileAccepted} 
          isProcessing={isProcessing} 
        />
      ) : (
        <div className="bg-[#435585]/50 rounded-xl p-6 text-center">
          <p className="text-[#818FB4] mb-4">
            Filename: {file?.name}<br />
            Total Rows: {rowCount}
          </p>
          <span
            onClick={() => setShowDropzone(true)}
            className="text-[#818FB4] hover:text-[#F5E8C7] transition-colors cursor-pointer"
          >
            Change CSV
          </span>
        </div>
      )}

      {file && !isProcessing && !showDropzone && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[#F5E8C7] mb-4">Column select and order</h2>
            <ColumnManager 
              columns={columns}
              selectedColumns={selectedColumns}
              onColumnsReorder={onColumnsReorder}
              onColumnToggle={onColumnToggle}
            />
          </div>
        </div>

      )}


      <div>
        <h2 className="text-xl font-semibold text-[#F5E8C7] mb-4">Settings</h2>
        <div className="flex items-center gap-2 max-w-xs">
          <Label htmlFor="rowLimit" className="text-[#F5E8C7] whitespace-nowrap">
            Row Limit:
          </Label>
          <Input
            id="rowLimit"
            type="number"
            value={rowLimit}
            onChange={(e) => setRowLimit(Number(e.target.value))}
            className="bg-[#435585] border-[#818FB4] text-[#F5E8C7]"
            min="1"
            max={rowCount}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleEnhanceClick}
          disabled={isEnhancing}
          size="lg"
          variant="secondary"
          className="space-x-2 bg-[#435585] hover:bg-[#435585]/80 text-[#F5E8C7] disabled:opacity-50"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Enhancing...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              <span>Enhance with AI</span>
            </>
          )}
        </Button>

        <Button
          onClick={exportFilteredCSV}
          disabled={isExporting}
          size="lg"
          className="space-x-2 bg-[#818FB4] hover:bg-[#818FB4]/80 text-[#363062] disabled:opacity-50"
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
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        rowCount={rowLimit}
        onSuccess={handlePaymentSuccess}
        isLoading={isEnhancing}
      />
    </div>
  );
}