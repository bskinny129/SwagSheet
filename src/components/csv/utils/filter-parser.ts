import { FilterGroup, FilterExpression } from '../types/filter';
import { createFilterGroup } from './filter-factory';

interface Token {
  type: 'operator' | 'condition' | 'parenthesis';
  value: string;
}

const tokenize = (expression: string): Token[] => {
  const tokens = expression.trim().toUpperCase().split(/\s+/);
  return tokens.map(token => {
    if (token === 'AND' || token === 'OR') {
      return { type: 'operator', value: token };
    }
    if (token === '(' || token === ')') {
      return { type: 'parenthesis', value: token };
    }
    return { type: 'condition', value: token };
  });
};

export const parseExpression = (expression: string): FilterExpression | null => {
  try {
    const tokens = tokenize(expression);
    const [root] = parseGroup(tokens, 0);
    return { root };
  } catch (error) {
    console.error('Error parsing expression:', error);
    return null;
  }
};

const parseGroup = (tokens: Token[], startIndex: number): [FilterGroup, number] => {
  const group = createFilterGroup();
  let i = startIndex;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'parenthesis' && token.value === ')') {
      return [group, i];
    }

    if (token.type === 'operator') {
      group.operator = token.value as 'AND' | 'OR';
    } else if (token.type === 'condition') {
      group.conditions.push({
        id: token.value,
        column: '',
        operator: 'equals',
        value: '',
      });
    } else if (token.type === 'parenthesis' && token.value === '(') {
      const [subGroup, newIndex] = parseGroup(tokens, i + 1);
      group.conditions.push(subGroup);
      i = newIndex;
    }

    i++;
  }

  return [group, i];
};