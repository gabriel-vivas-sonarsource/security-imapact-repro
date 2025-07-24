#!/usr/bin/env node

const fs = require('fs');

// Read the rules.txt file and extract rule numbers
const rulesContent = fs.readFileSync('rules.txt', 'utf8');
const urls = rulesContent.trim().split('\n').filter(line => line.trim());
const ruleNumbers = urls.map(url => url.match(/RSPEC-(\d+)/)?.[1]).filter(Boolean);

console.log(`Generating reproducers for ${ruleNumbers.length} rules...`);

// Create reproducers directory
if (!fs.existsSync('reproducers')) {
    fs.mkdirSync('reproducers');
}

// Rule reproducer patterns based on common SonarQube JavaScript rules
const reproducerPatterns = {
    '131': { // "switch" statements should have "default" clauses
        title: '"switch" statements should have "default" clauses',
        code: `// RSPEC-131: "switch" statements should have "default" clauses
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
anotherExample("unknown");`
    },
    
    '1121': { // Assignments should not be made from within sub-expressions  
        title: 'Assignments should not be made from within sub-expressions',
        code: `// RSPEC-1121: Assignments should not be made from within sub-expressions
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

example();`
    },
    
    '128': { // Switch cases should end with an unconditional "break" statement
        title: 'Switch cases should end with an unconditional "break" statement',
        code: `// RSPEC-128: Switch cases should end with an unconditional "break" statement

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
console.log(calculateScore("A")); // Will return 60 instead of 100`
    },
    
    '1874': { // Deprecated APIs should not be used
        title: 'Deprecated APIs should not be used',
        code: `// RSPEC-1874: Deprecated APIs should not be used
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

exampleDeprecatedAPIs();`
    },
    
    '905': { // Non-empty statements should change control flow or have at least one side-effect
        title: 'Non-empty statements should change control flow or have at least one side-effect',
        code: `// RSPEC-905: Non-empty statements should change control flow or have at least one side-effect
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

example();`
    },
    
    '1143': { // Jump statements should not occur in "finally" blocks
        title: 'Jump statements should not occur in "finally" blocks',
        code: `// RSPEC-1143: Jump statements should not occur in "finally" blocks
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

console.log(exampleWithReturn());`
    },
    
    '1763': { // Jump statements should not be followed by other statements
        title: 'Jump statements should not be followed by other statements',
        code: `// RSPEC-1763: Jump statements should not be followed by other statements
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

example(false);`
    },
    
    '1854': { // Unused assignments should be removed
        title: 'Unused assignments should be removed',
        code: `// RSPEC-1854: Unused assignments should be removed
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
console.log(anotherExample());`
    },
    
    '2486': { // Generic exceptions should not be ignored
        title: 'Generic exceptions should not be ignored',
        code: `// RSPEC-2486: Generic exceptions should not be ignored
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

example();`
    }
};

// Generate reproducer files
ruleNumbers.forEach(ruleNumber => {
    const pattern = reproducerPatterns[ruleNumber];
    
    if (pattern) {
        const filename = `reproducers/RSPEC-${ruleNumber}.js`;
        fs.writeFileSync(filename, pattern.code);
        console.log(`✓ Generated ${filename}: ${pattern.title}`);
    } else {
        // Generate a basic template for unknown rules
        const filename = `reproducers/RSPEC-${ruleNumber}.js`;
        const basicCode = `// RSPEC-${ruleNumber}: Unknown rule - needs manual implementation
// TODO: Add specific reproducer code for this rule

function example() {
    // Add code that would trigger RSPEC-${ruleNumber}
    console.log("Rule ${ruleNumber} reproducer - needs implementation");
}

example();`;
        fs.writeFileSync(filename, basicCode);
        console.log(`? Generated ${filename}: Template (needs manual implementation)`);
    }
});

// Generate a combined test file
const combinedContent = `// Combined SonarQube Rules Test File
// Contains reproducers for multiple JavaScript rules

${ruleNumbers.map(ruleNumber => {
    const pattern = reproducerPatterns[ruleNumber];
    if (pattern) {
        return `// ===== ${pattern.title} =====\n${pattern.code}\n`;
    } else {
        return `// ===== RSPEC-${ruleNumber} =====\n// TODO: Add reproducer for RSPEC-${ruleNumber}\nconsole.log("RSPEC-${ruleNumber} needs implementation");\n`;
    }
}).join('\n')}

console.log("All rule reproducers executed");`;

fs.writeFileSync('combined_reproducers.js', combinedContent);

console.log(`\nGenerated files:`);
console.log(`- ${ruleNumbers.length} individual reproducer files in reproducers/`);
console.log(`- combined_reproducers.js with all rules`);
console.log(`\nNext steps:`);
console.log(`1. Run: node combined_reproducers.js`);
console.log(`2. Scan with SonarQube to verify issues are detected`);
console.log(`3. Update templates for rules that need manual implementation`); 