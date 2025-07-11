export const validateExpression = (expression: string): boolean => {
  // Remove extra whitespace and normalize
  const normalized = expression.trim().toUpperCase();
  
  // Split into tokens, preserving parentheses
  const tokens = normalized.match(/[A-Z]+|\(|\)/g) || [];
  
  // Basic validation rules
  let expectCondition = true; // Start expecting a condition
  let parenCount = 0;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Handle parentheses
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
    
    // Handle operators
    if (token === 'AND' || token === 'OR') {
      if (expectCondition) return false;
      expectCondition = true;
      continue;
    }
    
    // Handle conditions (A-Z)
    if (/^[A-Z]$/.test(token)) {
      if (!expectCondition) return false;
      expectCondition = false;
      continue;
    }
    
    // Invalid token
    return false;
  }
  
  // Final checks
  if (parenCount !== 0) return false;
  if (expectCondition) return false;
  
  return true;
};