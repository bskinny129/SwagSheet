import { FilterConditionType, FilterGroup } from '../types';

export const evaluateCondition = (
  condition: FilterConditionType,
  row: Record<string, string>
): boolean => {
  const value = row[condition.column]?.toLowerCase() || '';
  const filterValue = condition.value.toLowerCase();

  switch (condition.operator) {
    case 'equals':
      return value === filterValue;
    case 'not_equals':
      return value !== filterValue;
    case 'contains':
      return value.includes(filterValue);
    case 'not_contains':
      return !value.includes(filterValue);
  }
};

export const evaluateGroup = (
  group: FilterGroup,
  row: Record<string, string>,
  conditions: FilterConditionType[]
): boolean => {
  if (!group?.conditions?.length) return true;

  const evaluatedConditions = group.conditions.map(item => {
    if ('operator' in item && typeof item.operator === 'string') {
      return evaluateGroup(item as FilterGroup, row, conditions);
    }
    const condition = conditions.find(c => c.id === (item as FilterConditionType).id);
    return condition ? evaluateCondition(condition, row) : true;
  });

  return group.operator === 'AND'
    ? evaluatedConditions.every(result => result)
    : evaluatedConditions.some(result => result);
};