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