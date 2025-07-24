// RSPEC-1874: "for...in" loops should filter properties
function processObject(obj) {
    // Noncompliant - no filtering of inherited properties
    for (var prop in obj) {
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

var instance = new Child();
processObject(instance); // Will include inherited properties