// RSPEC-1854: Unused assignments should be removed
function example() {
    var x = 5; // Noncompliant - x is assigned but never used
    var y = 10; 
    var z = 15; // Noncompliant - z is assigned but value is overwritten without being used
    
    z = 20; // This overwrites z without using the previous value
    
    // Only y and final z value are used
    return y + z;
}

function anotherExample() {
    var result = "initial"; // Noncompliant - assigned but immediately overwritten
    result = "final";
    
    var temp = getValue(); // Noncompliant - assigned but never used
    
    return result;
}

function getValue() {
    return "some value";
}

console.log(example());
console.log(anotherExample());