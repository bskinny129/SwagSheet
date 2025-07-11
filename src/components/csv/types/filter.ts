export interface FilterConditionType {
  id: string;
  column: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty';
  value: string;
}

export interface FilterGroup {
  id: string;
  operator: 'AND' | 'OR';
  conditions: (FilterConditionType | FilterGroup)[];
}

export interface FilterExpression {
  root: FilterGroup;
}

export interface FilterOperator {
  value: FilterConditionType['operator'];
  label: string;
}

export const filterOperators: FilterOperator[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: "doesn't contain" },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];