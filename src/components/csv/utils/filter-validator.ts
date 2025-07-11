export const validateExpression = (expression: string): boolean => {
  const normalized = expression.trim().toUpperCase();
  const tokens = normalized.match(/[A-Z]+|\(|\)/g) || [];
  
  let expectCondition = true;
  let parenCount = 0;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (token === '(') {
      parenCount++;
      expectCondition = true;
      continue;
    }
    
    if (token === ')') {
      parenCount--;
      if (parenCount < 0) return false;
      expectCondition = false;
      continue;
    }
    
    if (token === 'AND' || token === 'OR') {
      if (expectCondition) return false;
      expectCondition = true;
      continue;
    }
    
    if (/^[A-Z]$/.test(token)) {
      if (!expectCondition) return false;
      expectCondition = false;
      continue;
    }
    
    return false;
  }
  
  return parenCount === 0 && !expectCondition;
};