import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ColumnManager } from './ColumnManager';
import { PaymentModal } from './PaymentModal';
import { CSVUpload } from './CSVUpload';

export function CSVProcessor() {
  const [rowLimit, setRowLimit] = useState(1000);
  const [startingRow, setStartingRow] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);
  const [selectAll, setSelectAll] = useState(true);


  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedColumns(checked ? columns : []);
  };

  const handleFileAccepted = (file: File) => {
    setIsProcessing(false);
    setShowDropzone(false);
    setSelectAll(true);
    initialReadCSV(file);
  }

  const onColumnsReorder = (reorderedColumns: string[]) => {
    setColumns(reorderedColumns);
  };

  const onColumnToggle = (column: string) => {
    setSelectedColumns(prev => {
      const newSelection = prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column];
      setSelectAll(newSelection.length === columns.length);
      return newSelection;
    });
  };

  const initialReadCSV = (file: File) => {
    setFile(file);
    setIsProcessing(true);
    let rowCount = 0;
    let headers: string[] = [];
    console.log('Starting CSV processing');
    Papa.parse(file, {
      //preview: 1, // Only parse the first row to get headers
      step: (results) => {
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
        console.log("ROW COUNT");
        console.log(rowCount);
        setRowLimit(Math.max(rowCount - 1, 1));
        setRowCount(Math.max(rowCount - 1, 1));
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

      if (!file) {
        toast({
          title: 'Error',
          description: 'No file selected for export',
          variant: 'destructive',
        });
        return;
      }

      const orderedColumns = columns.filter(col => selectedColumns.includes(col));
      const csvRows: string[] = [];
      let currentRowCount = 0;
      let processedRows = 0;

      Papa.parse(file, {
        step: (results, parser) => {
          currentRowCount++;
          
          // Skip rows until we reach the starting row
          if (currentRowCount < startingRow) {
            return;
          }
          
          // Stop if we've processed the required number of rows
          if (processedRows >= rowLimit) {
            parser.abort();
            return;
          }
          
          const row = results.data as Record<string, any>;
          const filteredRow = orderedColumns.reduce((acc, col) => ({ ...acc, [col]: row[col] }), {});
          csvRows.push(Papa.unparse([filteredRow], { header: false }));
          processedRows++;
        },
        complete: () => {
          const csv = [Papa.unparse([orderedColumns]), ...csvRows].join('\n');
          const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
          const filename = `export-${randomFourDigit}-${Date.now()}.csv`;

          const csvBlob = new Blob([csv], { type: 'text/csv' });

          /*
          BNOTE: CAN'T SEEM TO UPLOAD TO SUPABASE WITHOUT BEING LOGGED IN (ALTHOUGH CAN USE SERVICE ACCOUNT)
          const { data: storageData, error: storageError } = await supabase.storage
            .from('csv-exports')
            .upload(filename, csvBlob);
          console.log(storageData);
          if (storageError) throw storageError;
          */

          const link = document.createElement('a');
          link.href = URL.createObjectURL(csvBlob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast({
            title: 'Export successful',
            description: 'Your CSV file has been processed and downloaded',
          });

          setIsExporting(false);
        },
        header: true,
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
          setIsExporting(false);
        },
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred during export',
        variant: 'destructive',
      });
      setIsExporting(false);
    }
  };

  const enhanceWithAI = async () => {
    try {
      setIsEnhancing(true);

      if (!file) {
        toast({
          title: 'Error',
          description: 'No file selected for export',
          variant: 'destructive',
        });
        return;
      }

      const orderedColumns = columns.filter(col => selectedColumns.includes(col));
      const csvRows: string[] = [];
      let currentRowCount = 0;
      let processedRows = 0;

      Papa.parse(file, {
        step: (results, parser) => {
          currentRowCount++;
          
          // Skip rows until we reach the starting row
          if (currentRowCount < startingRow) {
            return;
          }
          
          // Stop if we've processed the required number of rows
          if (processedRows >= rowLimit) {
            parser.abort();
            return;
          }
          
          const row = results.data as Record<string, any>;
          const filteredRow = orderedColumns.reduce((acc, col) => ({ ...acc, [col]: row[col] }), {});
          csvRows.push(Papa.unparse([filteredRow], { header: false }));
          processedRows++;
        },
        complete: async () => {
          const csv = [Papa.unparse([orderedColumns]), ...csvRows].join('\n');
          //const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
          //const filename = `export-${randomFourDigit}-${Date.now()}.csv`;

          const csvBlob = new Blob([csv], { type: 'text/csv' });
          const base64Csv = await convertBlobToBase64(csvBlob);
        
          // Call the Edge Function
          const { data: processedData, error: functionError } = await supabase.functions
            .invoke('ProcessCSV', {
              body: { csvData: base64Csv }, // Ensure the body is a JSON string
              //body: { foo: 'bar' },
            });
          console.log(processedData);
          if (functionError) throw functionError;

          // Upload original CSV
          /*
          const { data: storageData, error: storageError } = await supabase.storage
            .from('csv-exports')
            .upload(filename, csvBlob);

          if (storageError) throw storageError;

          //link.href = `https://qdbvgmshiyfteyejqhoi.supabase.co/storage/v1/object/public/csv-exports/${filename}?download=swagsheet-export.csv`;
          */

        
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
      

      /*
      

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
      */

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


  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Remove the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  /*
  const handleEnhanceClick = () => {
    //setShowPaymentModal(true);
    handlePaymentSuccess();
  };
  */

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    enhanceWithAI();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">

      {showDropzone ? (
        <CSVUpload 
          onFileAccepted={handleFileAccepted} 
          isProcessing={isProcessing} 
        />
      ) : (

        <div className="bg-primary-very-light-purple/10 rounded-xl p-6 text-center">
          { isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Filename: {file?.name}<br />
                  Total Rows: {rowCount}
                </p>
                <span
                  onClick={() => setShowDropzone(true)}
                  className="text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  Change CSV
                </span>
              </>
            )  
          }
          
        </div>
      )}

      {file && !isProcessing && !showDropzone && (
        <>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Column select and order</h2>
              <div className="ml-0 lg:ml-24">
                <ColumnManager 
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onColumnsReorder={onColumnsReorder}
                  onColumnToggle={onColumnToggle}
                  selectAll={selectAll}
                  onSelectAll={handleSelectAll}
                />
              </div>
            </div>
          </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          <div className="space-y-4 ml-0 lg:ml-24">
            <div className="flex items-center gap-2 max-w-xs">
              <Label htmlFor="startingRow" className="text-lg font-light text-gray-600 whitespace-nowrap">
                Starting Row:
              </Label>
              <Input
                id="startingRow"
                type="number"
                value={startingRow}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setStartingRow(Math.max(1, Math.min(value, rowCount)));
                }}
                className="text-lg font-light text-gray-600 w-32"
                min="1"
                max={rowCount}
              />
            </div>
            <div className="flex items-center gap-2 max-w-xs">
              <Label htmlFor="rowLimit" className="text-lg font-light text-gray-600 whitespace-nowrap">
                Row Limit:
              </Label>
              <Input
                id="rowLimit"
                type="number"
                value={rowLimit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const maxPossibleRows = Math.max(1, rowCount - startingRow + 1);
                  setRowLimit(Math.min(value, maxPossibleRows));
                }}
                className="text-lg font-light text-gray-600 w-32"
                min="1"
                max={Math.max(1, rowCount - startingRow + 1)}
              />
            </div>
            <div className="text-sm text-gray-500">
              Will export {startingRow !== 1 ? 'header and ' : ''}rows {startingRow} to {Math.min(startingRow + rowLimit - 1, rowCount)}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {/*}
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
            */}

          <Button
            onClick={exportFilteredCSV}
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
        </div>
        </>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        rowCount={Math.min(rowLimit, Math.max(0, rowCount - startingRow + 1))}
        onSuccess={handlePaymentSuccess}
        isLoading={isEnhancing}
      />
    </div>
  );
}