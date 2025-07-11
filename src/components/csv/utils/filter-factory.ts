import { FilterGroup, FilterExpression } from '../types/filter';

export const createFilterGroup = (
  operator: 'AND' | 'OR' = 'AND',
  conditions: FilterGroup['conditions'] = []
): FilterGroup => ({
  id: Math.random().toString(36).substr(2, 9),
  operator,
  conditions: [...conditions],
});

export const createFilterExpression = (): FilterExpression => ({
  root: createFilterGroup('AND', [])
});