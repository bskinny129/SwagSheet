import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FilterConditionType, FilterExpression, logicalOperators } from './types';
import { useFilterExpression } from './hooks/useFilterExpression';

interface FilterCombinationProps {
  conditions: FilterConditionType[];
  onChange: (expression: FilterExpression) => void;
}

export function FilterCombination({ conditions, onChange }: FilterCombinationProps) {
  const {
    expression,
    expressionText,
    error,
    handleExpressionChange,
    handleOperatorChange,
  } = useFilterExpression(conditions, onChange);

  if (conditions.length <= 1) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Filter Combination Logic</h2>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Combine filters using:</span>
          <Select
            value={expression.root.operator}
            onValueChange={handleOperatorChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {logicalOperators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Advanced Expression:</label>
            <span className="text-xs text-gray-500">
              Use A, B, C... for conditions, AND/OR operators, and parentheses
            </span>
          </div>
          <Input
            value={expressionText}
            onChange={(e) => handleExpressionChange(e.target.value)}
            placeholder="Example: A AND (B OR C)"
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}