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
var randWord,hiddenWord,woops,lives;

function firstSteps() {
    randWord = words[Math.floor(Math.random() * words.length)];
    console.log(randWord);

    hiddenWord = "";
    for (step = randWord.length; step > 0; step--) {
        hiddenWord += "_";
    }

    document.getElementById("demo").innerHTML = hiddenWord;

    woops = "";

    lives = 12;
    document.getElementById("remainingGuesses").innerHTML = lives;
}

firstSteps();

var keyPressed;
var wins = 0;
document.getElementById("wins").innerHTML = wins;

function bigBoy() {
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
                wins++
                document.getElementById("wins").innerHTML = wins;
                if (words === undefined || words.length == 0) {
                    document.getElementById("winner").innerHTML = "You win!"
                    // words = ["nauru", "kyrgyzstan", "brunei", "kiribati", "djibouti", "malta", "vanuatu", "liechtenstein", "macedonia"];
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
            // words = ["nauru", "kyrgyzstan", "brunei", "kiribati", "djibouti", "malta", "vanuatu", "liechtenstein", "macedonia"];
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

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function playerGuess(event) {
    var k = event.key;
    var alphabet = "qwertyuiopasdfghjklzxcvbnm";
    if (alphabet.indexOf(k.toLowerCase()) !== -1) {
        keyPressed = event.key.toLowerCase();
        console.log(keyPressed);
        bigBoy();
    }
}

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
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');
            infoWindow.open(map);
            map.setCenter(pos);
            map.setZoom(10);
        }, function () {
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

// uses large regex to check if browser is mobile
var check;
function mobileAndTabletCheck() {
    check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    console.log(check);
    return check;
};

if (mobileAndTabletCheck() === true) {
    document.getElementById("keyboard").style.display = "block";
}