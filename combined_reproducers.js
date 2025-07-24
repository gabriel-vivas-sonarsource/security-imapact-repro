// Combined SonarQube Rules Test File
// Contains reproducers for multiple JavaScript rules

// ===== Assignment operators should not be used in sub-expressions =====
// RSPEC-131: Assignment operators should not be used in sub-expressions
// Noncompliant: assignment in sub-expression
function test() {
    let x;
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
    }
    
    return result;
}

// Test the function
console.log(processValue(1)); // Will output "three" instead of "one"
console.log(processValue(2)); // Will output "three" instead of "two"
console.log(processValue(3)); // Will output "three"

// ===== "for...in" loops should filter properties =====
// RSPEC-1874: "for...in" loops should filter properties
function processObject(obj) {
    // Noncompliant - no filtering of inherited properties
    for (const prop in obj) {
        console.log(prop + ": " + obj[prop]);
    }
}

// Create object with inherited properties
function Parent() {
    this.parentProp = "parent value";
}

Parent.prototype.inheritedProp = "inherited value";

function Child() {
    Parent.call(this);
    this.childProp = "child value";
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const instance = new Child();
processObject(instance); // Will include inherited properties

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

// ===== "typeof" should be compared to valid strings =====
// RSPEC-1143: "typeof" should be compared to valid strings
function checkTypes(value) {
    // Noncompliant - invalid typeof comparison
    if (typeof value === "int") { // "int" is not a valid typeof result
        console.log("Integer");
    }
    
    // Noncompliant - another invalid typeof comparison
    if (typeof value === "array") { // "array" is not a valid typeof result
        console.log("Array");
    }
    
    // Noncompliant - typo in typeof comparison
    if (typeof value === "undefind") { // typo: should be "undefined"
        console.log("Undefined");
    }
    
    // More noncompliant examples
    if (typeof value === "bool") { // should be "boolean"
        console.log("Boolean");
    }
    
    if (typeof value === "str") { // should be "string"
        console.log("String");
    }
}

checkTypes(42);
checkTypes("hello");
checkTypes(true);
checkTypes([1, 2, 3]);

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