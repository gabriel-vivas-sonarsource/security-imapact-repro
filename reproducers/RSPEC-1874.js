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