// RSPEC-128: Switch cases should end with an unconditional "break" statement
function processValue(value) {
    let result = "";
    
    switch (value) {
        case 1:
            result = "one";
            // Noncompliant - missing break
        case 2:
            result = "two"; 
            // Noncompliant - missing break
        case 3:
            result = "three";
            break;
        default:
            result = "unknown";
    }
    
    return result;
}

// Test the function
console.log(processValue(1)); // Will output "three" instead of "one"
console.log(processValue(2)); // Will output "three" instead of "two"
console.log(processValue(3)); // Will output "three"