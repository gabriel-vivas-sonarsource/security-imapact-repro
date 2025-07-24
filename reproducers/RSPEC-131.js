// RSPEC-131: Assignment operators should not be used in sub-expressions
// Noncompliant: assignment in sub-expression
function test() {
    var x;
    if (x = getValue()) { // Noncompliant - assignment in condition
        console.log(x);
    }
    
    // Another noncompliant example
    while (x = getNextValue()) { // Noncompliant
        process(x);
    }
}

function getValue() {
    return Math.random() > 0.5 ? "hello" : null;
}

function getNextValue() {
    return Math.random() > 0.8 ? null : Math.floor(Math.random() * 100);
}

function process(value) {
    console.log("Processing:", value);
}

test();