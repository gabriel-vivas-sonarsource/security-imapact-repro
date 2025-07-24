// RSPEC-905: Non-empty statements should change control flow or have at least one side-effect
function example() {
    const x = 5;
    const y = 10;
    
    // Noncompliant - statement has no side effect
    x + y;
    
    // Noncompliant - comparison with no side effect
    x > y;
    
    // Noncompliant - property access with no side effect  
    x.toString;
    
    // Noncompliant - function reference with no call
    Math.random;
    
    console.log("Function executed");
}

example();