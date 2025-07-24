// RSPEC-1121: Assignments should not be made from within sub-expressions
// Noncompliant examples
function example() {
    let a, b, c;
    
    // Noncompliant - assignment in condition
    if (a = b) {
        console.log(a);
    }
    
    // Noncompliant - assignment in function call
    doSomething(a = 5);
    
    // Noncompliant - assignment in array literal
    const arr = [b = 10, c = 20];
    
    console.log(arr);
}

function doSomething(value) {
    return value * 2;
}

example();