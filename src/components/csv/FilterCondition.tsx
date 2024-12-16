import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterConditionType {
  id: string;
  column: string;
  operator: string;
  value: string;
}

interface FilterConditionProps {
  condition: FilterConditionType;
  columns: string[];
  label: string;
  onUpdate: (id: string, updates: Partial<FilterConditionType>) => void;
  onRemove: (id: string) => void;
}

const operators = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: "doesn't contain" },
];

export function FilterCondition({
  condition,
  columns,
  label,
  onUpdate,
  onRemove,
}: FilterConditionProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-500 w-6">{label}</span>
      <Select
        value={condition.column}
        onValueChange={(value) => onUpdate(condition.id, { column: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {columns.map((column) => (
            <SelectItem key={column} value={column}>
              {column}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(value) => onUpdate(condition.id, { operator: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="w-[200px]"
        placeholder="Enter value"
        value={condition.value}
        onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(condition.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}