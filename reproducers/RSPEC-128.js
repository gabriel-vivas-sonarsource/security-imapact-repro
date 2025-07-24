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