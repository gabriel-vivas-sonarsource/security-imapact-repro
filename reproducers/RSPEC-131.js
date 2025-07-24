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