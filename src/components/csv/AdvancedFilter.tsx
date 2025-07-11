import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CSVUpload } from './CSVUpload';
import { ExportButton } from './ExportButton';
import { FilterCondition } from './FilterCondition';
import { FilterCombination } from './FilterCombination';
import { useCSVHandler } from '../../hooks/use-csv-handler';
import { FilterConditionType, FilterExpression } from './types/filter';
import { evaluateGroup, createFilterExpression } from './utils/filter-logic';
import Papa from 'papaparse';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper functions for CSV export
const exportCSV = async (file: File, columns: string[], data: Record<string, string>[]): Promise<Blob> => {
  const orderedColumns = columns;
  const csv = Papa.unparse([orderedColumns, ...data.map(row => 
    orderedColumns.map(col => row[col] || '')
  )]);
  return new Blob([csv], { type: 'text/csv' });
};

const downloadCSV = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function AdvancedFilter() {
  const { csvData, isProcessing, processCSV } = useCSVHandler();
  const [showDropzone, setShowDropzone] = useState(true);
  const [conditions, setConditions] = useState<FilterConditionType[]>([]);
  const [filterExpression, setFilterExpression] = useState<FilterExpression>(createFilterExpression());
  const [filteredData, setFilteredData] = useState<Record<string, string>[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (csvData.rows.length > 0) {
      applyFilters();
    }
  }, [conditions, filterExpression, csvData.rows]);

  const handleFileAccepted = (file: File) => {
    setShowDropzone(false);
    processCSV(file);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: generateId(),
        column: csvData.columns[0] || '',
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const updateCondition = (id: string, updates: Partial<FilterConditionType>) => {
    setConditions(
      conditions.map((condition) =>
        condition.id === id ? { ...condition, ...updates } : condition
      )
    );
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  const applyFilters = () => {
    // If no conditions, show all data
    if (conditions.length === 0) {
      setFilteredData(csvData.rows);
      return;
    }

    // If only one condition, apply it directly
    if (conditions.length === 1) {
      const condition = conditions[0];
      const filtered = csvData.rows.filter((row: Record<string, string>) => {
        const value = row[condition.column] || '';
        const filterValue = condition.value;

        switch (condition.operator) {
          case 'equals':
            return value.toLowerCase() === filterValue.toLowerCase();
          case 'not_equals':
            return value.toLowerCase() !== filterValue.toLowerCase();
          case 'contains':
            return value.toLowerCase().includes(filterValue.toLowerCase());
          case 'not_contains':
            return !value.toLowerCase().includes(filterValue.toLowerCase());
          case 'is_empty':
            return value.trim() === '';
          case 'is_not_empty':
            return value.trim() !== '';
          default:
            return false;
        }
      });
      setFilteredData(filtered);
      return;
    }

    // For multiple conditions, use the filter expression
    if (filterExpression?.root?.conditions?.length) {
      const filtered = csvData.rows.filter((row: Record<string, string>) =>
        evaluateGroup(filterExpression.root, row, conditions)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(csvData.rows);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportCSV(csvData.file!, csvData.columns, filteredData);
      downloadCSV(blob, `filtered-${Date.now()}.csv`);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
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
          <p className="text-gray-600 mb-4">
            Filename: {csvData.file?.name}<br />
            Total Rows: {csvData.rowCount}
          </p>
          <span
            onClick={() => setShowDropzone(true)}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            Change CSV
          </span>
        </div>
      )}

      {!showDropzone && csvData.file && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Filter Conditions</h2>
          </div>

          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <FilterCondition
                key={condition.id}
                condition={condition}
                columns={csvData.columns}
                label={String.fromCharCode(65 + index)}
                onUpdate={updateCondition as any}
                onRemove={removeCondition}
              />
            ))}

            <Button
              onClick={addCondition}
              variant="outline"
              className="w-full py-6 border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter Condition
            </Button>
          </div>

          {conditions.length > 1 && (
            <FilterCombination
              conditions={conditions}
              onChange={setFilterExpression}
            />
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Showing {filteredData.length} of {csvData.rowCount} rows
              </span>
              <ExportButton
                onExport={handleExport}
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}