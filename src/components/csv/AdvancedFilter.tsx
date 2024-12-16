import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CSVUpload } from './CSVUpload';
import { ExportButton } from './ExportButton';
import { FilterCondition } from './FilterCondition';
import { FilterCombination } from './FilterCombination';
import { useCSVHandler } from '@/hooks/use-csv-handler';
import { FilterConditionType, FilterExpression } from './types';
import { evaluateGroup, createFilterExpression } from './utils/filter-logic';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function AdvancedFilter() {
  const { csvData, isProcessing, processCSV } = useCSVHandler();
  const [showDropzone, setShowDropzone] = useState(true);
  const [conditions, setConditions] = useState<FilterConditionType[]>([]);
  const [filterExpression, setFilterExpression] = useState<FilterExpression>(createFilterExpression());
  const [filteredData, setFilteredData] = useState<Record<string, string>[]>([]);

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
    if (!filterExpression?.root?.conditions?.length) {
      setFilteredData(csvData.rows);
      return;
    }

    const filtered = csvData.rows.filter((row) =>
      evaluateGroup(filterExpression.root, row, conditions)
    );

    setFilteredData(filtered);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {showDropzone ? (
        <CSVUpload onFileAccepted={handleFileAccepted} isProcessing={isProcessing} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Filter Conditions</h2>
            <Button
              onClick={() => setShowDropzone(true)}
              variant="outline"
              className="text-sm"
            >
              Change CSV
            </Button>
          </div>

          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <FilterCondition
                key={condition.id}
                condition={condition}
                columns={csvData.columns}
                label={String.fromCharCode(65 + index)}
                onUpdate={updateCondition}
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
                data={filteredData}
                columns={csvData.columns}
                disabled={filteredData.length === 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}