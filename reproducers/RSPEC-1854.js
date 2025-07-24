// RSPEC-1854: Unused assignments should be removed
function example() {
    const x = 5; // Noncompliant - x is assigned but never used
    const y = 10; 
    let z = 15; // Noncompliant - z is assigned but value is overwritten without being used
    
    z = 20; // This overwrites z without using the previous value
    
    // Only y and final z value are used
    return y + z;
}

function anotherExample() {
    let result = "initial"; // Noncompliant - assigned but immediately overwritten
    result = "final";
    
    const temp = getValue(); // Noncompliant - assigned but never used
    
    return result;
}

function getValue() {
    return "some value";
}

console.log(example());
console.log(anotherExample());