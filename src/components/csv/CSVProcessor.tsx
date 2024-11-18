// @ts-nocheck

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, Download, GripHorizontal } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface CSVData {
  [key: string]: string;
}

interface SortableRowProps {
  column: string;
  isSelected: boolean;
  onToggle: () => void;
}

function SortableRow({ column, isSelected, onToggle }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    overflow: 'hidden',
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="group hover:bg-[#363062]/50 text-lg"
      {...attributes}
    >
      <TableCell className="w-16 py-6">
        <GripHorizontal
          className="h-6 w-6 text-[#818FB4] cursor-move ml-4"
          {...listeners}
        />
      </TableCell>
      <TableCell className="text-[#F5E8C7] py-6">{column}</TableCell>
      <TableCell className="w-24 py-6 !pr-16">
        <div className="flex justify-center items-center h-full">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5 border-[#818FB4] data-[state=checked]:bg-[#818FB4] data-[state=checked]:border-[#818FB4]"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CSVProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [rowLimit, setRowLimit] = useState(1000);
  const [rowCount, setRowCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);

  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setShowDropzone(false);
      processCSV(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const processCSV = (file: File) => {
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
        setRowLimit(Math.max(rowCount - 1, 1)); // Ensure rowLimit is at least 1
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

  const exportFilteredCSV = () => {
    if (!file) return;
  
    const orderedColumns = columns.filter(col => selectedColumns.includes(col));
    
    let processedRows = 0;
    const filteredRows: CSVData[] = [];
  
    Papa.parse(file, {
      header: true,
      step: (results: Papa.ParseResult<CSVData>) => {
        if (processedRows < rowLimit) {
          const filteredRow = orderedColumns.reduce((acc, col) => {
            acc[col] = results.data[col];
            return acc;
          }, {} as CSVData);
          filteredRows.push(filteredRow);
          processedRows++;
        } else {
          return false; // Stop parsing after reaching rowLimit
        }
      },
      complete: () => {
        const csv = Papa.unparse(filteredRows);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'processed.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        toast({
          title: 'Error',
          description: `Failed to export CSV: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F5E8C7] mb-2">CSV Processor</h1>
        <p className="text-[#818FB4]">Upload, process, and export your CSV files</p>
      </div>

      {showDropzone ? (
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

      {isProcessing && (
        <div className="space-y-4">
          <Progress value={66} className="animate-pulse bg-[#435585]" />
          <p className="text-center text-sm text-[#818FB4]">
            Processing your CSV file...
          </p>
        </div>
      )}

{file && !isProcessing && !showDropzone && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[#F5E8C7] mb-4">Column select and order</h2>
            <div className="rounded-md border border-[#818FB4]/20 bg-[#435585]/50 overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table className="font-normal w-full table-fixed">
                  <TableHeader>
                    <TableRow className="text-lg">
                      <TableHead className="w-16 py-6 font-normal"></TableHead>
                      <TableHead className="text-[#F5E8C7] py-6 font-normal">Column Name</TableHead>
                      <TableHead className="w-24 text-center text-[#F5E8C7] py-6 pr-16 font-normal">Include</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody style={{ overflow: 'clip' }}>
                    <SortableContext
                      items={columns}
                      strategy={horizontalListSortingStrategy}
                    >
                      {columns.map((column) => (
                        <SortableRow
                          key={column}
                          column={column}
                          isSelected={selectedColumns.includes(column)}
                          onToggle={() => toggleColumn(column)}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          </div>

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

          <div className="flex justify-center">
            <Button
              onClick={exportFilteredCSV}
              size="lg"
              className="space-x-2 bg-[#818FB4] hover:bg-[#818FB4]/80 text-[#363062]"
            >
              <Download className="h-5 w-5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}