function test() {
    something.match("expression", function() {
        var a = 3;
        if (true) console.log('hello');
    });
}
