let alph = "abcdefghijklmnopqrstuvwxyz"
var letters = ['Shift', 'Control', 'CapsLock', 'Tab', 'Meta', 'Alt', 'Delete', 'Insert', 'Unidentified', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
let cerrent_letter = [];
let cerrent_id = [];
let cerrentKey = ''
let cerrent_word = []
let pushed_letter = [];
let gamekey = new Object()
let isPaused = false
let runner = 0;
let mainMenuGame = true
let count = 0;
let hightlite_selected_word = ''
let selected_word = ''
let len_selected_word = 0

let firestore = firebase.firestore()

let life = 5

//setting of game
let feq_per_sec = 1000
let amount = 50
let height_origin = 500
let speed = 10;
let score = 0;
let end_of_runner = 1000
let mod_runner = 1000

let username = ''

function mainMenu() {


    document.getElementById('mainText').innerText = 'Hello'
    window.addEventListener("keydown", function(e) {
        event.preventDefault();
        gamekey.keys = (gamekey.keys || []);
        gamekey.keys[e.key] = (e.type == "keydown");


        if (gamekey.keys && gamekey.keys['Enter'] && mainMenuGame) {
            gamekey.keys['Enter'] = false
            mainMenuGame = false
            document.getElementById('mainText').innerText = ''
            randombox()
        }
        if (gamekey.keys && gamekey.keys['Backspace'] && mainMenuGame) {
            gamekey.keys['Backspace'] = false
            username = username.substring(0, username.length - 1);
            document.getElementById('nameInput').innerText = username
        }
        if (gamekey.keys && gamekey.keys[e.key] && mainMenuGame) {
            gamekey.keys[e.key] = false
            if (!letters.includes(e.key)) {
                username += e.key
            }
            document.getElementById('nameInput').innerText = username
        }

    });


}


function randombox() {
    Timer = new Stopwatch();
    Timer.start();
    score = 0;

    let minus = 0

    window.setInterval(function() {
        if (runner == mod_runner) {
            let letter = randomLetter();
            if (minus > 700) {
                minus = 700
            } else {
                minus += 5
            }
            mod_runner += (1000 - minus);
            // console.log(count + " : " + mod_runner + ' ' + minus)
            boxObj(Math.random() * height_origin, letter);
        }
        if (!isPaused) {
            runner++
        }
        if (gamekey.keys && gamekey.keys[' '] && isPaused == false) {

            isPaused = true
            gamekey.keys[' '] = false
        }
        if (gamekey.keys && gamekey.keys[' '] && isPaused == true) {
            isPaused = false
            gamekey.keys[' '] = false
        }
    }, 1);

    window.addEventListener('keydown', function(e) {
        e.preventDefault();
        gamekey.keys = (gamekey.keys || []);
        gamekey.keys[e.key] = (e.type == "keydown");
        cerrentKey = e.key;

    })
}

let _id = 0
let del_id = 0

function boxObj(height, letter_show) {
    let redbox = new Object();
    redbox.top = height;
    redbox.left = 0;
    let x = redbox.left;
    let top = height;
    let boxdiv = document.createElement('div');
    boxdiv.className = 'box'
    boxdiv.style.top = top + 'px';


    let text = document.createElement('a');
    text.className = 'text2'
    text.innerText = letter_show.toUpperCase();

    let text_hightlight = document.createElement('a');
    text_hightlight.className = 'text-hightlight'
    text_hightlight.innerHTML = '';

    let text_no_hightlight = document.createElement('a');
    text_no_hightlight.className = 'text-no-hightlight'
    text_no_hightlight.innerHTML = letter_show.toUpperCase();

    boxdiv.appendChild(text);
    boxdiv.appendChild(text_hightlight);
    boxdiv.appendChild(text_no_hightlight);

    document.body.appendChild(boxdiv);
    count++



    let run = setInterval(function go() {
        if (len_selected_word > 0 && gamekey.keys && gamekey.keys[cerrentKey]) {
            gamekey.keys[cerrentKey] = false
            if (cerrentKey == selected_word[letters_collected] && isPaused == false) {
                letters_collected++
                // console.log("letters_collected check : " + letters_collected)
                if (letters_collected == selected_word.length) {
                    score++
                    hightlite_selected_word += cerrentKey

                    let first_let = boxdiv.childNodes[0].innerText[0]
                    let o = cerrent_letter.indexOf(hightlite_selected_word[0])

                    letters_collected = 0
                    selected_word = ''
                    len_selected_word = 0
                    cerrentKey = ''


                    clearInterval(del_id);
                    let e = document.getElementById(del_id);
                    document.getElementById('score').innerText = 'Score : ' + score

                    gamekey.keys[cerrentKey] = false
                    pushed_letter.push(cerrentKey);
                    cerrent_word.splice(o, 1)
                    cerrent_letter.splice(o, 1);
                    cerrent_id.splice(o, 1);
                    document.body.removeChild(e);



                } else {
                    hightlite_selected_word += cerrentKey
                    let del = document.getElementById(del_id);
                    del.childNodes[1].innerText = hightlite_selected_word.toUpperCase();
                    del.childNodes[2].innerText = selected_word.substr(hightlite_selected_word.length - 1, selected_word.length).toUpperCase();

                }
            } else {
                letters_collected = 0
                selected_word = ''
                len_selected_word = 0
                hightlite_selected_word = ''
                let del2 = document.getElementById(del_id);
                del2.childNodes[1].innerText = ''
                del2.childNodes[2].innerText = del2.childNodes[0].innerText
            }

        } else if (gamekey.keys && cerrent_letter.includes(cerrentKey) && isPaused == false && len_selected_word == 0) {
            gamekey.keys[cerrentKey] = false
            hightlite_selected_word = ''
            _id = cerrent_letter.indexOf(cerrentKey)
            del_id = cerrent_id[cerrent_letter.indexOf(cerrentKey)]
            selected_word = cerrent_word[_id].substring(1)
            len_selected_word = selected_word.length
            hightlite_selected_word += cerrentKey
            let del3 = document.getElementById(del_id);
            del3.childNodes[1].innerText = hightlite_selected_word.toUpperCase()
            del3.childNodes[2].innerText = selected_word.toUpperCase()
        }



        if (x == end_of_runner) {
            if (boxdiv.childNodes[0].innerText.toLowerCase().substring(1) == selected_word) {
                letters_collected = 0
                selected_word = ''
                len_selected_word = 0
            }
            clearInterval(run);
            boxdiv.remove();
            cerrent_letter.shift();
            cerrent_word.shift()
            cerrent_id.shift();
            life--
            console.log(life)
            if (life == 0) {
                isPaused = true
            }

        }
        if (!isPaused) {
            x++;
            boxdiv.style.left = x + "px";
        }
        cerrentKey = ''
    }, speed);

    boxdiv.id = run;
    cerrent_id.push(run)
}

let letters_collected = 0

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomLetter() {
    let pos_let = Math.floor(Math.random() * alph.length)
    let letter_random = alph[pos_let];
    if (cerrent_letter.length > alph.length) {
        cerrent_letter = [];
    }
    while (cerrent_letter.includes(letter_random)) {
        pos_let = Math.floor(Math.random() * alph.length)
        letter_random = alph[pos_let];
    }
    cerrent_letter.push(letter_random);
    num_of_word = word_all[pos_let].length
    word_show = word_all[pos_let][Math.floor(Math.random() * num_of_word)]
    cerrent_word.push(word_show)
    return word_show;
}

// timer *******************************************

function Stopwatch() {
    let runner = createTimer(),
        startButton = createButton(),
        offset,
        clock = 0,
        interval;

    function createTimer() {
        return document.createElement("h1");
    }

    function createButton() {
        window.addEventListener("keydown", function(e) {
            gamekey.keys = (gamekey.keys || []);
            gamekey.keys[e.key] = (e.type == "keydown");
            cerrentKey = e.key;
            if (gamekey.keys && gamekey.keys[' '] && isPaused == false || life == 0) {

                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }
            if (gamekey.keys && gamekey.keys[' '] && isPaused == true) {
                start();
            }
            event.preventDefault();
        });
    }

    function start() {
        if (!interval) {
            offset = Date.now();
            interval = setInterval(update, 1);
        }
    }



    function update() {
        clock += delta();
        render();
    }

    function render() {
        let min = Math.floor((clock % (1000 * 60 * 60)) / (1000 * 60));
        if (min < 10) {
            min = '0' + min
        }
        let sec = Math.floor((clock % (1000 * 60)) / 1000);
        if (sec < 10) {
            sec = '0' + sec
        }
        let ms = clock % 1000
        if (ms < 10) {
            ms = ms + '00'
        } else if (ms < 100) {
            ms = ms + '0'
        }
        document.getElementById('time').innerHTML = min + ":" + sec + ":" + ms;
    }

    function delta() {
        var now = Date.now(),
            d = now - offset;
        offset = now;
        return d;
    }


    this.start = start;

};