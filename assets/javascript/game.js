var words = ["nauru", "kyrgyzstan", "brunei", "kiribati", "djibouti", "malta", "vanuatu", "liechtenstein", "macedonia"];

var wordsAndLatLng = {
    nauru: {
        latLng: { lat: -0.5284144, lng: 166.9342384 },
        zoom: 10
    },
    kyrgyzstan: {
        latLng: { lat: 41.20438, lng: 74.76610 },
        zoom: 5
    },
    brunei: {
        latLng: { lat: 4.53528, lng: 114.72767 },
        zoom: 5
    },
    kiribati: {
        latLng: { lat: 1.826555, lng: -157.346610 },
        zoom: 9
    },
    djibouti: {
        latLng: { lat: 11.82514, lng: 42.59028 },
        zoom: 5
    },
    malta: {
        latLng: { lat: 35.93750, lng: 14.37542 },
        zoom: 6
    },
    vanuatu: {
        latLng: { lat: -15.37671, lng: 166.95916 },
        zoom: 6
    },
    liechtenstein: {
        latLng: { lat: 47.16600, lng: 9.55537 },
        zoom: 7
    },
    macedonia: {
        latLng: { lat: 41.60864, lng: 21.74527 },
        zoom: 5
    }
}

var randWord = words[Math.floor(Math.random() * words.length)];
console.log(randWord);

var hiddenWord = "";
for (step = randWord.length; step > 0; step--) {
    hiddenWord += "_";
}

document.getElementById("demo").innerHTML = hiddenWord;

var woops = "";

var lives = 12;
document.getElementById("remainingGuesses").innerHTML = lives;

// document.getElementById("keyboardBtn").addEventListener("touchend", function( event ) {
//     document.getElementById("hiddenInput").focus({preventScroll:true});
//   }, false);

document.onkeyup = function playerGuess(event) {
    var k = event.key;
    var alphabet = "qwertyuiopasdfghjklzxcvbnm";
    if (alphabet.indexOf(k.toLowerCase()) !== -1) {

        function getIndicesOf(searchStr, str) {
            var searchStrLen = searchStr.length;
            if (searchStrLen == 0) {
                return [];
            }
            var startIndex = 0, index, indices = [];
            while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                indices.push(index);
                startIndex = index + searchStrLen;
            }
            return indices;
        }

        String.prototype.replaceAt = function (index, replacement) {
            return this.substr(0, index) + replacement + this.substr(index + replacement.length);
        }

        var keyPressed = event.key.toLowerCase();
        console.log(keyPressed);

        if (randWord.indexOf(keyPressed) !== -1) {
            var indices = getIndicesOf(keyPressed, randWord);
            console.log(indices);
            //loop through indices, place each value in hiddenWord[]
            indices.forEach(function (index) {
                console.log(index);
                let hiddenWordUpdated = hiddenWord.replaceAt(index, keyPressed);
                console.log(hiddenWord);
                document.getElementById("demo").innerHTML = hiddenWordUpdated;
                //strings are immutable
                hiddenWord = hiddenWordUpdated;
                if (hiddenWord === randWord) {
                    //change map location to hiddenWord

                    map.panTo(wordsAndLatLng[hiddenWord].latLng); //Make map global;
                    map.setZoom(wordsAndLatLng[hiddenWord].zoom);
                    marker.setPosition(wordsAndLatLng[hiddenWord].latLng);
                    marker.setAnimation(google.maps.Animation.DROP);

                    var j = words.indexOf(hiddenWord);
                    words.splice(j, 1);
                    console.log(words);
                    if (words === undefined || words.length == 0) {
                        document.getElementById("winner").innerHTML = "You win!"
                        return;
                    }
                    randWord = words[Math.floor(Math.random() * words.length)];
                    console.log(randWord + "~");
                    hiddenWord = "";
                    for (step = randWord.length; step > 0; step--) {
                        hiddenWord += "_";
                    }
                    document.getElementById("demo").innerHTML = hiddenWord;

                    woops = "";
                    document.getElementById("wrongGuesses").innerHTML = "";

                    lives = 12;
                    document.getElementById("remainingGuesses").innerHTML = lives;
                }
            });
            document.getElementById("wrong").innerHTML = "";
        }
        else {
            lives -= 1;
            document.getElementById("remainingGuesses").innerHTML = lives;
            if (lives < 1) {
                document.getElementById("remainingGuesses").innerHTML = "You lose!";
                return;
            }

            document.getElementById("wrong").innerHTML = "Guess again!";

            if (woops.indexOf(keyPressed) == -1) {
                var woopsUpdated = woops.concat(keyPressed);
                document.getElementById("wrongGuesses").innerHTML = woopsUpdated;
                woops = woopsUpdated;
            }
        }
    }
}

var myStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
];
var map;
var marker;
var infoWindow;
function initMap() {
    var hccc = { lat: 40.730743, lng: -74.065945 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: hccc,
        gestureHandling: 'cooperative',
        styles: myStyles
    });
    marker = new google.maps.Marker({
        position: hccc,
        map: map,
        animation: google.maps.Animation.DROP,

    });
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('You are here.');
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(10);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);

}

