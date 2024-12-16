export interface FilterConditionType {
  id: string;
  column: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: string;
}

export interface CSVData {
  columns: string[];
  rows: Record<string, string>[];
  rowCount: number;
  file: File | null;
}

export interface LogicalOperator {
  value: 'AND' | 'OR';
  label: string;
}

export interface FilterGroup {
  id: string;
  operator: LogicalOperator['value'];
  conditions: (FilterConditionType | FilterGroup)[];
}

export interface FilterExpression {
  root: FilterGroup;
}

export const logicalOperators: LogicalOperator[] = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

export const operators = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: "doesn't contain" },
] as const;