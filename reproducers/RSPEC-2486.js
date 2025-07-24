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