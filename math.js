function operatorPrecendence(operator) {
    switch (operator) {
      case '+':
        return 1;
      case '-':
        return 1;
      case '*':
        return 0;
      case '/':
        return 0;
      default:
        return null;
    }
  }
  
  function parseOperation(left, operations, numbers, i) {
    let operator = operations[i];
    let operand = parseFloat(numbers[i]);
    
    let right = operand;
    let precedence = operatorPrecendence(operator);
  
    if (precedence === null)
      return null;
  
    let nextPrecedence = precedence;
  
    if (operations.length > i + 1) {
      let nextOp = operations[i + 1];
      nextPrecedence = operatorPrecendence(nextOp);
      
      if (nextPrecedence === null)
        return null;
  
      if (nextPrecedence < precedence) {
        let pResult = parseOperation(right, operations, numbers, i + 1);
  
        if (pResult === null)
          return null;
  
        right = pResult[0];
        i = pResult[1];
  
      }
    }
    
    let result;
  
    switch (operator) {
      case '+':
        result = left + right;
        break;
      case '-':
        result = left - right;
        break;
      case '*':
        result = left * right;
        break;
      case '/':
        result = left / right;
        break;
      default:
        result = null;
        break;
    }
  
    return [ result, i ];
  }
  
  let lastAnswer;
  
  function checkEvaluation(input) {
    if (input.startsWith("/")) return ChatLib.clearChat(9922336);
    const question = input.replace(/\s/g, '').replace(/x|X/, '*');
  
    if (!question) return ChatLib.clearChat(9922336);
  
    const numbers = question.split(/[-+*/]/);
    const operations = question.match(/-|\+|\*|\//g);
  
    if (!numbers || !operations) return ChatLib.clearChat(9922336);
  
    let result = parseFloat(numbers[0]);
    numbers.shift();
  
    for (let i = 0; i < operations.length; i++)
    {
      let pResult = parseOperation(result, operations, numbers, i);
  
      if (pResult === null) return new Message("Invalid operation").chat();
  
      result = pResult[0];
      i = pResult[1];
    }
  
    const message = new Message("&9" + result).setChatLineId(9922336);
  
    if (lastAnswer != result) {
      ChatLib.clearChat(9922336);
      message.chat();
      lastAnswer = result;
    }
  }
  
  export { checkEvaluation };