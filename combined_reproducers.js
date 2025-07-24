// Combined SonarQube Rules Test File
// Contains reproducers for multiple JavaScript rules

// ===== "switch" statements should have "default" clauses =====
// RSPEC-131: "switch" statements should have "default" clauses
function processValue(value) {
    let result = "";
    
    // Noncompliant - missing default clause
    switch (value) {
        case 1:
            result = "one";
            break;
        case 2:
            result = "two";
            break;
        case 3:
            result = "three";
            break;
        // Missing default clause
    }
    
    return result;
}

function anotherExample(status) {
    // Another noncompliant switch without default
    switch (status) {
        case "active":
            console.log("Status is active");
            break;
        case "inactive":
            console.log("Status is inactive");
            break;
    }
}

console.log(processValue(1));
console.log(processValue(99)); // Will return empty string
anotherExample("unknown");

// ===== Assignments should not be made from within sub-expressions =====
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

// ===== Switch cases should end with an unconditional "break" statement =====
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
            break;
    }
    
    return result;
}

function handleUserAction(action) {
    switch (action) {
        case "save":
            console.log("Saving data...");
            saveData();
            // Noncompliant - missing break, will fall through to delete!
        case "delete":
            console.log("Deleting data...");
            deleteData();
            break;
        case "cancel":
            console.log("Operation cancelled");
            // Noncompliant - missing break
        default:
            console.log("Unknown action");
            break;
    }
}

function calculateScore(grade) {
    let score = 0;
    
    switch (grade) {
        case "A":
            score = 100;
            // Noncompliant - missing break
        case "B":
            score = 80;
            // Noncompliant - missing break  
        case "C":
            score = 60;
            break;
        case "D":
            score = 40;
            // Noncompliant - missing break
        case "F":
            score = 0;
            break;
    }
    
    return score;
}

function saveData() {
    console.log("Data saved");
}

function deleteData() {
    console.log("Data deleted");
}

// Test the functions
console.log(processValue(1)); // Will output "three" instead of "one"
console.log(processValue(2)); // Will output "three" instead of "two"
handleUserAction("save"); // Will save AND delete!
console.log(calculateScore("A")); // Will return 60 instead of 100

// ===== Deprecated APIs should not be used =====
// RSPEC-1874: Deprecated APIs should not be used
function exampleDeprecatedAPIs() {
    // Noncompliant - using deprecated escape() function
    const encoded = escape("hello world"); // Deprecated, use encodeURIComponent instead
    console.log("Encoded:", encoded);
    
    // Noncompliant - using deprecated unescape() function  
    const decoded = unescape(encoded); // Deprecated, use decodeURIComponent instead
    console.log("Decoded:", decoded);
    
    // Noncompliant - using deprecated String.substr()
    const text = "Hello World";
    const substr = text.substr(0, 5); // Deprecated, use substring() or slice() instead
    console.log("Substring:", substr);
    
    // Noncompliant - using deprecated Date methods
    const date = new Date();
    const year = date.getYear(); // Deprecated, use getFullYear() instead
    console.log("Year:", year);
    
    // Noncompliant - using deprecated String.fontcolor() 
    const coloredText = "Hello".fontcolor("red"); // Deprecated HTML wrapper method
    console.log("Colored text:", coloredText);
}

exampleDeprecatedAPIs();

// ===== Non-empty statements should change control flow or have at least one side-effect =====
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

// ===== Jump statements should not occur in "finally" blocks =====
// RSPEC-1143: Jump statements should not occur in "finally" blocks
function exampleWithReturn() {
    try {
        console.log("In try block");
        return "try result";
    } catch (e) {
        console.log("In catch block");
        return "catch result";
    } finally {
        console.log("In finally block");
        return "finally result"; // Noncompliant - return in finally block
    }
}

function exampleWithBreak() {
    for (let i = 0; i < 5; i++) {
        try {
            if (i === 2) {
                throw new Error("Test error");
            }
            console.log("Processing:", i);
        } catch (e) {
            console.log("Caught error for:", i);
        } finally {
            if (i === 3) {
                break; // Noncompliant - break in finally block
            }
        }
    }
}

function exampleWithContinue() {
    for (let i = 0; i < 5; i++) {
        try {
            console.log("Before operation:", i);
        } finally {
            if (i === 2) {
                continue; // Noncompliant - continue in finally block  
            }
            console.log("Finally block:", i);
        }
    }
}

console.log(exampleWithReturn());

// ===== Jump statements should not be followed by other statements =====
// RSPEC-1763: Jump statements should not be followed by other statements
function example(condition) {
    if (condition) {
        return "early return";
        console.log("This will never execute"); // Noncompliant - unreachable code after return
    }
    
    for (let i = 0; i < 10; i++) {
        if (i === 5) {
            break;
            console.log("This will never execute"); // Noncompliant - unreachable code after break
        }
        
        if (i === 3) {
            continue;
            console.log("This will never execute"); // Noncompliant - unreachable code after continue  
        }
        
        console.log(i);
    }
    
    return "normal return";
}

example(false);

// ===== Unused assignments should be removed =====
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

// ===== Generic exceptions should not be ignored =====
// RSPEC-2486: Generic exceptions should not be ignored
function example() {
    try {
        riskyOperation();
    } catch (e) {
        // Noncompliant - exception is caught but ignored (empty catch block)
    }
    
    try {
        anotherRiskyOperation();
    } catch (error) {
        // Noncompliant - exception is caught but only logged without proper handling
        console.log("Error occurred");
        // Should at least log the actual error or rethrow
    }
    
    try {
        yetAnotherRiskyOperation();
    } catch (ex) {
        // Noncompliant - generic exception handling without specific action
        return null; // Swallowing the exception
    }
}

function riskyOperation() {
    throw new Error("Something went wrong in risky operation");
}

function anotherRiskyOperation() {
    throw new TypeError("Type error occurred");
}

function yetAnotherRiskyOperation() {
    throw new RangeError("Range error occurred");
}

example();


console.log("All rule reproducers executed");