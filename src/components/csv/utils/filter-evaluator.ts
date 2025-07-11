import { FilterConditionType, FilterGroup } from '../types/filter';

export const evaluateCondition = (
  condition: FilterConditionType,
  row: Record<string, string>
): boolean => {
  const originalValue = row[condition.column] || '';
  const value = originalValue.toLowerCase();
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
    case 'is_empty':
      return originalValue.trim() === '';
    case 'is_not_empty':
      return originalValue.trim() !== '';
    default:
      return false;
  }
};

export const evaluateGroup = (
  group: FilterGroup,
  row: Record<string, string>,
  conditions: FilterConditionType[]
): boolean => {
  if (!group?.conditions?.length) return true;

  const evaluatedConditions = group.conditions.map(item => {
    // Check if this is a nested group (has AND/OR operator)
    if ('operator' in item && 'conditions' in item && (item.operator === 'AND' || item.operator === 'OR')) {
      return evaluateGroup(item as FilterGroup, row, conditions);
    }
    
    // It's a condition - check if it's a complete condition object or just an ID reference
    if ('column' in item && 'operator' in item && 'value' in item) {
      // It's already a complete condition object
      return evaluateCondition(item as FilterConditionType, row);
    } else {
      // It's just an ID reference, find the actual condition
      const condition = conditions.find(c => c.id === (item as any).id);
      return condition ? evaluateCondition(condition, row) : true;
    }
  });

  return group.operator === 'AND'
    ? evaluatedConditions.every(result => result)
    : evaluatedConditions.some(result => result);
};