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