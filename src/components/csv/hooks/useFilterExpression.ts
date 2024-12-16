import { useState, useEffect } from 'react';
import { FilterConditionType, FilterExpression } from '../types';
import { createFilterExpression, parseExpression } from '../utils/filter-logic';
import { validateExpression } from '../utils/expression-validator';

interface UseFilterExpressionResult {
  expression: FilterExpression;
  expressionText: string;
  error: string;
  handleExpressionChange: (value: string) => void;
  handleOperatorChange: (value: 'AND' | 'OR') => void;
}

export const useFilterExpression = (
  conditions: FilterConditionType[],
  onChange: (expression: FilterExpression) => void
): UseFilterExpressionResult => {
  const [expression, setExpression] = useState<FilterExpression>(createFilterExpression());
  const [expressionText, setExpressionText] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (conditions.length > 0) {
      const defaultText = conditions
        .map((_, index) => String.fromCharCode(65 + index))
        .join(' AND ');
      setExpressionText(defaultText);
      
      const newExpression = createFilterExpression();
      conditions.forEach((condition) => {
        newExpression.root.conditions.push(condition);
      });
      setExpression(newExpression);
      onChange(newExpression);
    }
  }, [conditions, onChange]);

  const handleOperatorChange = (value: 'AND' | 'OR') => {
    const newExpression = {
      ...expression,
      root: {
        ...expression.root,
        operator: value,
      },
    };
    setExpression(newExpression);
    onChange(newExpression);
    setExpressionText(expressionText.replace(/AND|OR/g, value));
  };

  const handleExpressionChange = (value: string) => {
    setExpressionText(value.toUpperCase());
    const isValid = validateExpression(value);
    
    if (!isValid) {
      setError('Invalid expression format');
      return;
    }
    
    setError('');
    const parsed = parseExpression(value);
    if (parsed) {
      setExpression(parsed);
      onChange(parsed);
    }
  };

  return {
    expression,
    expressionText,
    error,
    handleExpressionChange,
    handleOperatorChange,
  };
};