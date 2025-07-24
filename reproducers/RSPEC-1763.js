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