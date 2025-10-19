'use strict';

//TODO: PAUSE
    //? Créer un vrai menu de pause
        //? Bloque le timer
        //? Évite le conflit avec l'apparition d'une bombe
        //? Cache le game board

//TODO: VISUELS
    //? Implémenter l'affichage du nombre de bombes désamorcées
        //? L'interval à côté de chaque bombe ? Gauche ? Droite ?
    //? Les boutons du bas, stp bg, faut faire un truc.
    //* [DONE] Meilleure indication de quand on se trouve sur la bombe.

//TODO: euuuh
    //? Bouton rejouer





//TODO: Mini-jeu
    //* [DONE] Tous les X temps, une case apparaît en rouge.
    //* [DONE] L'utilisateur doit appuyer sur Enter sur la case rouge le plus rapidement possible.
    //// Score = Temps moyen sur 5 cases rouges.



//TODO:---------------------------------------- (TODO - END) --------------------------------------------------
//*------------------------------------------- (CONST - START) ------------------------------------------------

    //* Locations
    let letters = [];
    let numbers = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    //* Bindings
    const ups = ['ArrowUp', 'Z', 'W'];
    const lefts = ['ArrowLeft', 'Q', 'A'];
    const downs = ['ArrowDown', 'S', 'S'];
    const rights = ['ArrowRight', 'D', 'D'];
    const bindingsOrder = [ups, lefts, downs, rights]
    
    //* Defined set of color for the active buttons
    const buttonColor = ['lightcoral', 'cornflowerblue', 'sandybrown', 'plum'];
    const buttonText = ['ARROWS', 'ZQSD', 'WASD'];

    //* 
    const defusedTime = [];

//*------------------------------------------- (CONST - END) --------------------------------------------------
//*------------------------------------------- (LET - START) --------------------------------------------------

    //* DEFAULT VALUES
    let currLocation = 'A1'
    let indexLetter = 0;
    let indexNumber = 0;

    let currLocationTarget = "B2";
    let indexLetterTarget = 1;
    let indexNumberTarget = 1;

    let size = 5;
    
    //* Current controls for the user
    let bindings = 0;

    //* Loop for the bindings incrementated when CUSTOM bindings is added
    let maxBindings = 2;
    
    //* Lock for gameLock()
    let lock = false;

    //* Lock for newTarget()
    let bombSet = false;
    let interval;

    //* GameBoard Creation
    let gameBoard;
    let noPreviousTable = true;

    let inspect = 0;



//*---------------------------------------------------- (LET - END) --------------------------------------------------
//?------------------------------------------- (DOM GENERATED ELEMENTS - START) ------------------------------------------------

//? INPUT(TYPE="NUMBER") | Normal way to edit the Game Board size.
    let sizeSelector = document.createElement('input');
    document.getElementById('config').append(sizeSelector);

    sizeSelector.id = 'sizeSelector';
    sizeSelector.type = "range";
    sizeSelector.defaultValue = 5;
    sizeSelector.max = 7;
    sizeSelector.min = 3;
    
    sizeSelector.addEventListener("change", newGameBoard);


//? BINDINGS BUTTONS | Indactor of current bindings.
    for (let i = 0; i < 3; i++){
        let newButton = document.createElement('button');
        document.getElementById('gameBoardButtonBox').append(newButton);
        
        newButton.id = `button${i}`;
        newButton.class = buttonColor[i];
        newButton.textContent = buttonText[i];
    }



//? BINDINGS CONFIG | ASSETS OF MAIN_PANEL
    let configAssetLeft = document.createElement('div');
    document.getElementById('config').append(configAssetLeft);
    
    configAssetLeft.id = 'configAssetLeft';
    configAssetLeft.className = "configWindow";
    configAssetLeft.textContent = "CONFIG"
    
    configAssetLeft.addEventListener("click", configPanelSwitch);


//? BINDINGS CONFIG | MAIN_PANEL
    let configWindow = document.createElement('table');
    document.getElementById('config').append(configWindow);

    configWindow.id = 'configWindow';
    configWindow.className = "configWindow";

 
    const configTextContent= ["CUSTOM INPUTS", "UP", "LEFT", "DOWN", "RIGHT"];
    for (let count = 0; count < 6; count++){
    
        let newRow = document.createElement('tr');
        configWindow.append(newRow);
        
        let newCell = document.createElement('td');
        newRow.append(newCell);

        newCell.id = `configCell${count-1}`
        newCell.textContent = configTextContent[count];
        if (count !== 0 && count !== 5) {
            let newInput = document.createElement('input');
            newCell.append(newInput);

            newInput.id = newCell.id+'_INPUT'
            newInput.type = "string";
            newInput.maxLength = 1;
            newInput.autocomplete = false;
        }
        else if (count === 5) {
            let newButton = document.createElement('button');
            newCell.append(newButton);

            newButton.type = "submit";
            newButton.textContent = "SAVE"

            newButton.addEventListener('click', verifyCustomBindings);
        }
    }



//? GAME_BOARD | ASSETS OF GAME_BOARD
    let gameBoardBG1 = document.createElement('div');
    document.getElementById('gameBoardBox').append(gameBoardBG1);
    
    gameBoardBG1.id = 'gameBoardBG1';
    

//? BOMBS | ASSETS LEFT
    for (let i = 0; i < 5; i++){
        let bomb = document.createElement('div');
        document.getElementById('bombs').append(bomb);

        bomb.id = `bomb${i}`;
        console.log(bomb.id);
        
        bomb.textContent = '💣';
    }

//?------------------------------------------ (DOM GENERATED ELEMENTS - END) -----------------------------------------------------
//!-------------------------------------------- (CUSTOM BINDINGS - START) --------------------------------------------------------

//* Verifies all inputs are valid
function verifyCustomBindings(){
    let verification = [];
    for (let i = 0; i < 4; i++){
        const customNewInput = (document.getElementById)(`configCell${i}_INPUT`).value.toUpperCase();
        if (customNewInput !== "" && customNewInput !== " ") {
        verification.push(customNewInput);
        };
    }

    if (verification.includes('E') === false) {
        configPanelSwitch();
        setCustomBindings();
        gameLock()
    }
}

//* Opens and Closes the Config Panel
function configPanelSwitch() {

    if (lock === false) {
        gameLock();
    }

    let configCheck = document.getElementById('config').className;
    if (configCheck === "configOff"){
        document.getElementById('config').className = "configOn"
    } else {
        document.getElementById('config').className = "configOff"
    }
}

//* Applies custom bindings
function setCustomBindings() {

    let i = 0
    while (i < 4) {     
        let currBinding = bindingsOrder[i];
        
        //* Removes previous CUSTOM bindings if exist.
        if (currBinding[3] !== undefined) {
            currBinding.splice(3,1);
        }

        //* Sets new bindings.
        const newKey = (document.getElementById(`configCell${i}_INPUT`).value).toUpperCase()
        currBinding.push(newKey);
        i++
    }

    //* Generates the CUSTOM button
    if (document.querySelector(`#button3`) === null) {
        generateCUSTOMButton();
    };

    //* Set the current binding on the CUSTOM bindings
    while (3-bindings !== 0){
        switchBindings();
    }

}

//* Creates a new CUSTOM button for bindings
function generateCUSTOMButton() {
        let button3 = document.createElement('button');
        document.getElementById('gameBoardButtonBox').append(button3);
        
        button3.id = 'button3';
        button3.textContent= 'CUSTOM';

        maxBindings++;
}

//!--------------------------------------------- (CUSTOM BINDINGS - END) --------------------------------------------------------
//!---------------------------------------------- (BOARD MAKER - START) ---------------------------------------------------------

//* Creates a newBoard to play on.
function newGameBoard() {

    setUpBoard();
    
    //* Board size creation | [i = NUMBERS] [j = LETTERS]
    let i = 0;
    while (i < size) {
        
        //* Creates and attaches rows to board.
        let newRow = document.createElement('tr');
        let j = 1;
        while (j <= size) {

            //* Creates and attaches cells to rows.
            let newCell = document.createElement('td');
            newCell.id = (`${alphabet[i]}${j}`);
            newCell.textContent = (`${alphabet[i]}${j}`);
            newCell.style.width = (100/size) + '%';

            newRow.append(newCell);
            
            //* As many numbers as columns.
            if (numbers.length < j){numbers.push(j);}
            j++;
        }
        gameBoard.append(newRow)
        
        //* As many letters as rows.
        if (letters.length <= i){letters.push(alphabet[i]);}
        i++
    }
    //* Attaches board to boardBox.
    document.getElementById('gameBoardBox').appendChild(gameBoard);   
    noPreviousTable = false;
    
    randomLocation()
}

//* Clears the board if necessary and makes a new one
function setUpBoard() {
    //* Redefines default values
    currLocation = "A1";
    indexLetter = 0;
    indexNumber = 0;

    currLocationTarget = "B2";
    indexLetterTarget = 1;
    indexNumberTarget = 1;

    letters = ['A'];
    numbers = [1];
    lock = false;

    //* Board creation
    gameBoard = document.createElement('table');
    gameBoard.id = 'gameBoard';
    if (sizeSelector.value < 10 && sizeSelector.value > 0){
        size = sizeSelector.value;
    }
    else {
        sizeSelector.value = (sizeSelector.value < 1) ? 1 : 10;
        size = sizeSelector.value;
    }

    //* Delete old board
    if (noPreviousTable === false){    
        document.getElementById('gameBoardBox').removeChild(document.getElementById('gameBoard'));
    }
}

//* Sets a random starting location
function randomLocation() {
    changeBackgroundColor(currLocation, "radial-gradient(circle, aquamarine 0%, mediumspringgreen");

    indexLetter = Math.floor(Math.random() * letters.length);
    indexNumber = Math.floor(Math.random() * numbers.length);
    currLocation = letters[indexLetter] + numbers[indexNumber];
    // console.log(currLocation);
    newTarget();
    
    changeBackgroundColor(currLocation, 'radial-gradient(circle, #7FD2FF 0%, #005DFA)')
}

//!------------------------------------------------ (BOARD MAKER - END) ----------------------------------------------------------
//!------------------------------------------ (MAIN KEY INTERACTIONS - START) ----------------------------------------------------

//* Redirects (or not) based on key pressed.
function keyRedirect(e) {
    e = e.key;

    //* Prevents action while setting custom bindings
    let isFocusOnInput = document.activeElement.id;
    isFocusOnInput = isFocusOnInput.split("configCell");
    if (isFocusOnInput.length === 2) {
        isFocusOnInput = isFocusOnInput[1].split("_");
        isFocusOnInput = isFocusOnInput[1];
    }
    if (isFocusOnInput === 'INPUT'){return;};

    //* NO_CAPS allowed
    if (e !== "ArrowUp" && e !== "ArrowDown" && e !== "ArrowLeft" && e !== "ArrowRight" && e !== "Enter" && e !== "Escape") {
        e = e.toUpperCase();
    }

    //* Shoots at a cell
    if (e === 'Enter' && document.getElementById('config').className === "configOff"
    || e === ' ' && document.getElementById('config').className === "configOff") {
        if (currLocation === currLocationTarget && bombSet === true){
            newTarget();
        }
        else {
            console.log("TO BE IMPLEMENTED");
        }
    }

    //* Locks the game
    if (e === 'Escape' && document.getElementById('config').className === "configOff") {
        gameLock();
    }

    //* Switch Bindings
    else if (e === 'E') {switchBindings()}

    //* Size Up
    else if (e === '+') {
        if (parseInt(sizeSelector.value) !== 10) {
            sizeSelector.value++;
            newGameBoard();
        }
    }

    //* Size Down
    else if (e === '-') {
        if (parseInt(sizeSelector.value) !== 1) {
            sizeSelector.value--;
            newGameBoard();
        }
    }

    //* Only allows movement based on current bindings
    if (lock === true) {return;}
    if (e === ups[bindings] ||
        e === downs[bindings] ||
        e === lefts[bindings] ||
        e === rights[bindings]){
        workingKey(e);
    }
    else {return;}
}

//* Makes sure no error will ensue.
function workingKey(e){
    let splitLocation = currLocation.split("");

    let newInt = "";
    if (splitLocation.length > 2) {
        for (let loc of splitLocation) {
            if (loc !== splitLocation[0]) {
                newInt += loc;
            }
        }
        newInt = parseInt(newInt);

        splitLocation.splice(1, splitLocation.length);
        splitLocation.push(newInt)
    }
    

    //* Sets vertical limit
    if (splitLocation[0] === letters[0] && e === ups[bindings]) {return;}
    else if (splitLocation[0] === letters[letters.length-1] && e === downs[bindings]) {return;}

    //* Sets horizontal limit
    if (parseInt(splitLocation[1]) === numbers[0] && e === lefts[bindings]){return;}
    else if (parseInt(splitLocation[1]) === numbers[numbers.length-1] && e === rights[bindings]){return;}



    //* No error -> Allows movement
    indexLetter = letters.indexOf(splitLocation[0])
    indexNumber = numbers.indexOf(parseInt(splitLocation[1]))
    alterLocation(e);
}

//* Alter Location
function alterLocation(e) {
    //* Drops focus on previous location
    if (currLocation !== currLocationTarget || bombSet === false) {
        changeBackgroundColor(currLocation, "radial-gradient(circle, aquamarine 0%, mediumspringgreen");
    }
    else {
        changeBackgroundColor(currLocation, "black");
        document.getElementById(currLocation).style.color = 'black';
    }

    //* Alters current location based on movement
    switch (e) {
        case ups[bindings]: indexLetter--; break;
        case downs[bindings]: indexLetter++; break;
        case lefts[bindings]: indexNumber--; break;
        case rights[bindings]: indexNumber++; break;
    }

    currLocation = letters[indexLetter] + numbers[indexNumber];

    //* Sets focus on current location
    if (currLocation !== currLocationTarget || bombSet === false) {
        changeBackgroundColor(currLocation, 'radial-gradient(circle, #7FD2FF 0%, #005DFA)')
    }
    else if (bombSet === true) {
        changeBackgroundColor(currLocation, 'radial-gradient(circle, gainsboro 0%, #005DFA');
    }
}

//!-------------------------------------------- (MAIN KEY INTERACTIONS - END) -----------------------------------------------------
//!------------------------------------------- (ALT KEY INTERACTIONS - START) -----------------------------------------------------

//* Blocks the game.
function gameLock() {
    switch(lock){
        case true: lock = false;
        if (currLocation !== currLocationTarget || bombSet === false) {
            changeBackgroundColor(currLocation, 'radial-gradient(circle, #7FD2FF 0%, #005DFA)');
        }
        else {
            changeBackgroundColor(currLocation, 'black');
        };
        break;
            
        case false: lock = true;
            changeBackgroundColor(currLocation, 'radial-gradient(circle, lightCoral 0%, #EE204D)');
        break;
    }
}

//* Switchs the preset for movement
function switchBindings() {
    document.getElementById(`button${bindings}`).style.backgroundColor = 'lightgray';

    bindings++;
    if (bindings > maxBindings) {bindings=0}

    document.getElementById(`button${bindings}`).style.backgroundColor = buttonColor[bindings];
}

//!-------------------------------------------- (ALT KEY INTERACTIONS - END) ------------------------------------------------------
//!-------------------------------------------------- (TOOLS - START) -------------------------------------------------------------

function newTarget() {
    
    
    if (interval !== undefined) {
        interval = Math.round(interval*100)/100;
        defusedTime.push(interval);
        inspect = defusedTime.length-1;
        let bombDefusedText = `🔒 ${defusedTime[inspect]}s`
        document.getElementById('bomb'+(size-(inspect+1))).textContent = bombDefusedText;
    }

    document.getElementById(currLocation).textContent = currLocation
    changeBackgroundColor(currLocation, 'radial-gradient(circle, #7FD2FF 0%, #005DFA)')
    document.getElementById(currLocationTarget).style.color = "black";

    if (defusedTime.length > size-1) {
        currLocationTarget = 0;
        console.log("FIN DU JEU"); 
        console.log(defusedTime); 
        bombSet = true;
        return;
    }
    bombSet = false;
    
    indexLetterTarget = Math.floor(Math.random() * letters.length);
    indexNumberTarget = Math.floor(Math.random() * numbers.length);
    currLocationTarget = letters[indexLetterTarget] + numbers[indexNumberTarget];
    // console.log(currLocationTarget);
    
    if (currLocation === currLocationTarget) {
        newTarget();
    }

    let isThatATime = Math.random() * 3000 + 2000;
    setTimeout(() => {

    
    document.getElementById(currLocationTarget).textContent = "💣"
    changeBackgroundColor(currLocationTarget, 'black');
    bombSet = true;
    let start = Date.now()/1000;
    myTimer(start);
    }, isThatATime);

}







//!--------------------------------------------------- (TOOLS - END) --------------------------------------------------------------
//!-------------------------------------------------- (TOOLS - START) -------------------------------------------------------------

function changeBackgroundColor (id, color) {
    document.getElementById(id).style.background = color;
}

function myTimer(start) {
    let timer = Date.now()/1000;
    interval = timer-start;
    document.getElementById(`bomb${(size-inspect)-1}`).textContent = '💣 ' + Math.round((interval) * 100) / 100 + 's';
    
    if (currLocationTarget === 0) {
        document.getElementById('myTest').textContent = "FIN DU JEU";
        return;
    }
    
    if (bombSet === true){
        setTimeout(() => {
            myTimer(start);
        }, 100);
    }
}








//!--------------------------------------------------- (TOOLS - END) --------------------------------------------------------------