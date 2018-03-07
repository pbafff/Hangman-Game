var words = ["nauru", "kyrgystan", "brunei", "kiribati", "djibouti", "malta", "vanuatu", "liechtenstein", "macedonia"];

var randWord = words[Math.floor(Math.random() * words.length)];
document.write(randWord + "<br>");
var hiddenWord = "";

for (step = randWord.length; step > 0; step--) {
    hiddenWord += "_";
}

document.getElementById("demo").innerHTML = hiddenWord;


function playerGuess(event) {
    function getIndicesOf(searchStr, str) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices =[];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }
    
    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
    
    var keyPressed = event.key;
    console.log(keyPressed);
    
    if (randWord.indexOf(keyPressed) !== -1) {
        var indices = getIndicesOf(keyPressed, randWord);
        console.log(indices);
        //loop through indices, place each value in hiddenWord[]
        indices.forEach(function(index) {
            console.log(index);
            let hiddenWordUpdated = hiddenWord.replaceAt(index, keyPressed);
            console.log(hiddenWord);
            document.getElementById("demo").innerHTML = hiddenWordUpdated; 
            //strings are immutable
            hiddenWord = hiddenWordUpdated;} );
    }
    else {
        document.getElementById("wrong").innerHTML = "Guess again!";
    }
    
}    


