//Initialisation
const nbrImgAvatar = 10;
const logRollMax = 4;

let playerOneActif = Boolean(true);
let playerTwoActif = Boolean(false);
let selectPlayerOne = Boolean(false);
let playerOneGlobalScore = 0;
let playerTwoGlobalScore = 0;
let playerOneCurrentScore = 0;
let playerTwoCurrentScore = 0;
let nbrRollPlayerOne = 0;
let indexAvatar = 0;
let virtualWinningScore = 0;

let diceType = parseInt(document.getElementById('diceType').value);
let losingDiceFace = parseInt(document.getElementById('losingDiceFace').value);
let winningScore = parseInt(document.getElementById('winningScore').value);
let setSound=document.getElementById('setSound').checked;
let defaultTheme=document.getElementById('defaultTheme').checked;
let implicitWin = document.getElementById('implicitWin').checked;

// no avatar choosen for any player
let avatarOneSelected='99';
let avatarTwoSelected='99';

// array contains path to avatar images and defaul names
let arrayAvatar=[];
let arrayAvatarName=['Aquila', 'Andromeda', 'Ara', 'Libra', 'Cetus', 'Aries', 'Pyxis', 'Bootes', 'Caelum', 'Carina'];


let pathAvatarPrefix = "images/avatar-";
let pathAvatarSufix = ".png";

for (let i=0; i < nbrImgAvatar; i++){
    let numOrdre = '0';
    if ( i > 9) {
        poste = i;
    }else{
        poste = numOrdre + i;
    }
    sourceAvatar=pathAvatarPrefix + poste + pathAvatarSufix;
    arrayAvatar.push([sourceAvatar,arrayAvatarName[i]]);
    
};

// sort array to change order of avatars images on page load
shuffleArray(arrayAvatar);

// array for biggest die up to 12 sides
let arrayDiceDodecagone=[];
// this array to manage selected die
let arrayDiceFaces=[];

let pathDiceFacesPrefix = "images/diceFace-";
let pathDiceFacesSufix = ".png";

for (let i=0; i < 12; i++){
    let j = i + 1;
    let numOrdre = '0';
    if ( i > 8) {
        poste = j;
    }else{
        poste = numOrdre + j;
    }
    sourceDiceFaces=pathDiceFacesPrefix + poste + pathDiceFacesSufix;
    arrayDiceDodecagone.push(sourceDiceFaces);
};

// array to manage history of dice roll
let rollLogPlayer = [];

// Buttons definition
let btnNewGame=document.getElementById('newGame');
btnNewGame.addEventListener('click',newGameFct);

let btnCancelGame=document.getElementById('cancelGame');
btnCancelGame.addEventListener('click',cancelGameFct);
btnCancelGame.disabled = false;

let btnRoll=document.getElementById('roll');
btnRoll.addEventListener('click',rollFct);
btnRoll.disabled = true;

let btnHold=document.getElementById('hold');
btnHold.addEventListener('click', holdFct);
btnHold.disabled = true;

let btnSetPlayers=document.getElementById('setPlayers');
btnSetPlayers.addEventListener('click', setPlayersFct);
btnSetPlayers.disabled = false;

let btnAvatarId=document.getElementById('avatarId');
btnAvatarId.addEventListener('click', avatarIdFct);


// Create players descriptions
createPlayer('playerOneId', 'div1', 'playerOneName', 'playerOneGlobalScore', 'playerOneCurrentScore');
createPlayer('playerTwoId', 'div2', 'playerTwoName', 'playerTwoGlobalScore', 'playerTwoCurrentScore');

// toggle player one, player two definition
setPlayersFct();
avatarIdFct();

let positionPlayerOne=document.getElementById('playerOneId');
let positionPlayerTwo=document.getElementById('playerTwoId');

// when modal used to set parameters, get values and control them
$('#settingModal').on('hidden.bs.modal', function (event) {
    
    diceType = parseInt(document.getElementById('diceType').value);
    losingDiceFace = parseInt(document.getElementById('losingDiceFace').value);
    winningScore = parseInt(document.getElementById('winningScore').value);
    setSound=document.getElementById('setSound').checked;
    defaultTheme=document.getElementById('defaultTheme').checked;
    implicitWin = document.getElementById('implicitWin').checked;

    if (isNaN(diceType) || isNaN(losingDiceFace) || isNaN(winningScore)){
        alert(document.getElementById('alertNaN').innerText);
        diceType = 6;
        losingDiceFace = 1;
        winningScore = 100;
    }

    if (diceType < 1 || diceType > 12  || losingDiceFace < 1 || losingDiceFace > diceType || winningScore < 1){
        alert(document.getElementById('alertCoherence').innerText + diceType + ' / ' + losingDiceFace + ' / ' + winningScore );
        diceType = 6;
        losingDiceFace = 1;
        winningScore = 100;
    }

    document.getElementById('diceType').value = diceType;
    document.getElementById('losingDiceFace').value = losingDiceFace;
    document.getElementById('winningScore').value = winningScore;

    if (defaultTheme){
        arrayTheme = document.querySelectorAll('.defaultTheme');
        // alert('Nombre elements avec class= defaultTheme ' + arrayTheme.length);
        for (const item of arrayTheme) {
            item.classList.replace('defaultTheme', 'darkMode')
        }
    }else{
        arrayTheme = document.querySelectorAll('.darkMode');
        for (const item of arrayTheme) {
            item.classList.replace('darkMode', 'defaultTheme')
        }
    }
})

// function associated to play button
// Initialization of scores, number of rolls, rolls log and force player one to be active
// maybe during the previous run, player have been swap as a result, new swap to establish default players positions
function newGameFct(){

    nbrRollPlayerOne = 0;
    nbrRollPlayerTwo = 0;
    playerOneActif = Boolean(true);
    playerTwoActif = Boolean(false);
    virtualWinningScore = 0;
    document.getElementById('setPlayers').disabled = true;

    // clean up dice track and rolls log
    document.getElementById('dice').innerHTML = '';
    document.getElementById('rollLogPlayer').innerHTML = '';

    // When game running, setting is in read-only mode
    let para = document.querySelector('#formSetting');
    arrayPara = para.querySelectorAll('input');
    for (const item of arrayPara) {
        item.disabled = true;      
    }
    document.getElementById('settingModalLabel').innerText = 'No change when playing.'

    document.getElementById('diceTrack').classList.remove('d-none');


    if ( positionPlayerOne.classList.contains('order-3')) {
        positionPlayerOne.classList.remove('order-3');
        positionPlayerOne.classList.add('order-1');
        positionPlayerTwo.classList.remove('order-1');
        positionPlayerTwo.classList.add('order-3');
    }

    //maybe dice type has change (by modal setting) from the previous run, so that die dimension is applied
    arrayDiceFaces = arrayDiceDodecagone.slice (0, diceType);

    // the two players must choose an avatar before game starting
    if ((avatarOneSelected != 99) && (avatarTwoSelected != 99)){
        btnNewGame.disabled = true;
        btnCancelGame.disabled = false;
        btnRoll.disabled = false;
        // btnSettingModal.disabled = true;
        document.getElementById('playerOneName').disabled = true;
        document.getElementById('playerTwoName').disabled = true;

        var tt=document.getElementById('dice');
        tt.innerHTML = '';

        playerOneActif = Boolean(true);
        playerTwoActif = Boolean(false);
        playerOneGlobalScore = 0;
        playerTwoGlobalScore = 0;
        playerOneCurrentScore = 0;
        playerTwoCurrentScore = 0;

        document.getElementById('playerOneGlobalScore').innerText = 'Global Score ' + playerOneGlobalScore;
        document.getElementById('playerOneCurrentScore').innerText = 'Global Score ' + playerOneCurrentScore;

        document.getElementById('playerTwoGlobalScore').innerText = 'Global Score ' + playerTwoGlobalScore;
        document.getElementById('playerTwoCurrentScore').innerText = 'Global Score ' + playerTwoCurrentScore;

        // List of avatars not visible during playing
        tt=document.getElementById('avatarId');
        tt.classList.add('d-none');
      
    }else{
        alert(document.getElementById('alertSelecPlayers').innerText);
        cancelGameFct();
    }

    if ( document.getElementById('playerOneName').value == document.getElementById('playerTwoName').value){
        alert('It would be better if each player get his own different name.')
    }
}

function cancelGameFct(){

    playerOneActif = Boolean(true);
    playerTwoActif = Boolean(false);
    playerOneGlobalScore = 0;
    playerTwoGlobalScore = 0;
    playerOneCurrentScore = 0;
    playerTwoCurrentScore = 0;
    document.getElementById('playerTwoName').value = '';
    document.getElementById('playerOneName').value = '';
    document.getElementById('playerOneName').disabled = false;
    document.getElementById('playerTwoName').disabled = false;
    document.getElementById('setPlayers').disabled = false;

    btnRoll.disabled = true;
    btnHold.disabled = true;
    btnNewGame.disabled = false;

    // Setting is accessible in modification mode
    let para = document.querySelector('#formSetting');
    arrayPara = para.querySelectorAll('input');
    for (const item of arrayPara) {
        item.disabled = false;      
    }

    document.getElementById('settingModalLabel').innerText = 'Set up your favorite';

    // no avatar choosen for any player
    avatarOneSelected='99';
    avatarTwoSelected='99';

    // avatars images are visible again, so that players can choose an other one before the new game
    document.getElementById('avatarId').classList.remove('d-none');

    // clean up dice track and rolls log
    document.getElementById('dice').innerHTML = '';
    document.getElementById('rollLogPlayer').innerHTML = '';

    document.getElementById('diceTrack').classList.add('d-none');

    let element = document.getElementById("div1");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

    element = document.getElementById("div2");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Function assign to keep button
function holdFct(){

    // to avoid activate hold button without roll first
    btnHold.disabled = true;

    // erase roll log
    var element = document.getElementById('rollLogPlayer');
    while (element.firstChild) {
    element.removeChild(element.firstChild);
    }
    nbrRollPlayerOne = 0;
    
    // apply and display updated scores
    if (playerOneActif){
        playerOneGlobalScore += playerOneCurrentScore;
        playerOneCurrentScore = 0;
        tt=document.getElementById('playerOneGlobalScore');
        tt.innerText='Global Score ' + playerOneGlobalScore;
        tt=document.getElementById('playerOneCurrentScore');
        tt.innerText='Current score ' + playerOneCurrentScore;
        // document.getElementById('playerTwoId').classList.add('playerMove');
    }else{
        playerTwoGlobalScore += playerTwoCurrentScore;
        playerTwoCurrentScore = 0;
        tt=document.getElementById('playerTwoGlobalScore');
        tt.innerText='Global Score ' + playerTwoGlobalScore;
        tt=document.getElementById('playerTwoCurrentScore');
        tt.innerText='Current score ' + playerTwoCurrentScore;
    }
    
    // check if one of the player is winning
    // in affirmative case : applause and congratulations
    // else move active player to the left
    if ((playerOneGlobalScore >= winningScore) || (playerTwoGlobalScore >= winningScore)){

        if (setSound){
            new Audio('/sounds/win.mp3').play();
        }
        
        let para = document.getElementById('dice');
        let division;

        if (playerOneActif) {
            para.innerText = document.getElementById('playerOneName').value +  ', you win !';
            division = document.querySelector('#div1');
        }else{
            para.innerText = document.getElementById('playerTwoName').value +  ', you win !';
            division = document.querySelector('#div2');
        }
        
        arrayPara = division.querySelectorAll('img');
        for (const item of arrayPara) {
            image = item.src;      
        }
        winner = document.createElement('img');
        winner.src = image;
        winner.className = "img-fluid jump";
        para.appendChild(winner);

        btnRoll.disabled = true;
        btnNewGame.disabled = false;
    }
    
    // hands changing after a player has click hold
    swapPlayerFct();
    
    playerOneActif =! playerOneActif;
    playerTwoActif =! playerTwoActif;
    if (playerOneActif){
       document.getElementById('playerOneId').classList.add('playerMove');
    }else{
        document.getElementById('playerTwoId').classList.add('playerMove');
    }
}

function rollFct(){
    // let the possibility to the player to keep his score
    btnHold.disabled = false;

    document.getElementById('playerOneId').classList.remove('playerMove');
    document.getElementById('playerTwoId').classList.remove('playerMove');

    // dice roll simulation with shuffle array containing die sides, choose the side to be exposed
    //always [0] because array is shuffled
    shuffleArray(arrayDiceFaces);
    var imageDice = document.createElement('img');
    imageDice.src = arrayDiceFaces[0];

    var tt=document.getElementById('dice');
    // apply a specific class to activate the appropriate animation, depending on dice track dimension
    if (tt.clientWidth < 300) {
        if (tt.clientWidth < 220){
            imageDice.className = "img-fluid diceRollSmall";
        }else{
            imageDice.className = "img-fluid diceRollMedium";
        }
    }else{
        imageDice.className = "img-fluid diceRoll";
    }

    // Display the randomized side of the die
    tt.innerHTML='';
    tt.appendChild(imageDice);
    
    // Adding current roll in the player's log 
    tt = document.getElementById('rollLogPlayer');
    image = 'idLogPlayerOne-' + nbrRollPlayerOne;
    elthisto = document.createElement('img');
    elthisto.src = arrayDiceFaces[0];
    elthisto.className = "float-left";
    elthisto.id = image;
    elthisto.width = "20";
    elthisto.height = "20";
    tt.appendChild(elthisto);

    // For correct display on smaller screen, roll log list is limited to the constant logRollMax
    // so in case of overflow, the older roll is erased of the log
    if ( nbrRollPlayerOne > logRollMax){
        index = parseInt(nbrRollPlayerOne - logRollMax - 1);
        image = 'idLogPlayerOne-' + index
        elt=document.getElementById(image)
        tt.removeChild(elt);
    }

    nbrRollPlayerOne ++;

     // keep current score before adding score roll
    let score = 0;
    if (playerOneActif) {
        score = playerOneCurrentScore;
    }else{
        score = playerTwoCurrentScore;
    }

    // the score is calculated from the order number contained in the name of the die side just after "-"
    indexOfFirst = arrayDiceFaces[0].indexOf('-');
    let valeur = parseInt(arrayDiceFaces[0].substr(indexOfFirst + 1 ,2));

    // if the roll egal the side determinated as loosing side, current score force to zero and 
    // this is the other player turn
    if (valeur == losingDiceFace){
        score = 0;
        playerOneCurrentScore = score;
        playerTwoCurrentScore = score;
        if (setSound){
            new Audio('/sounds/lose.mp3').play();
        }
            
        holdFct();

    }else{
        score += valeur;
    }

    // display updated current score
    if (playerOneActif) {
        tt=document.getElementById('playerOneCurrentScore');
        tt.innerText='Current score ' + score;
        playerOneCurrentScore = score;
        virtualWinningScore = playerOneGlobalScore + score;
    }else{
        tt=document.getElementById('playerTwoCurrentScore');
        tt.innerText='Current score ' + score;
        playerTwoCurrentScore = score;
        virtualWinningScore = playerTwoGlobalScore + score;
    }

    // check if updated score is up to the winning score
    // in this case applause and display congratulation to the winner
    // to proceed to evaluation, global score is considered, (implicit / explicit victory) otherwise click hold button is required to
    // take into account the current score
   
    if ( implicitWin && (virtualWinningScore >= winningScore) ){
        if (setSound){
            new Audio('/sounds/win.mp3').play();
        }

        let para = document.getElementById('dice');
        let division;

        if (playerOneActif) {
            para.innerText = document.getElementById('playerOneName').value + ', you win !';
            division = document.querySelector('#div1');
          
        }else{
            para.innerText = document.getElementById('playerTwoName').value + ', you win !';
            division = document.querySelector('#div2');
        }
    
        arrayPara = division.querySelectorAll('img');
        for (const item of arrayPara) {
            image = item.src;      
        }
        winner = document.createElement('img');
        winner.src = image;
        winner.className = 'img-fluid jump';
        para.appendChild(winner);

        btnRoll.disabled = true;
        btnHold.disabled = true;
        btnNewGame.disabled = false;
    }
}

// function activated when changing hand
// the active player and his roll log is always on the left (or on the top for smaller screen)
function swapPlayerFct(){
        if ( positionPlayerOne.classList.contains('order-1')) {

            positionPlayerOne.classList.remove('order-1');
            positionPlayerOne.classList.add('order-3');
          
            positionPlayerTwo.classList.remove('order-3');
            positionPlayerTwo.classList.add('order-1');
         
        }else{

            positionPlayerOne.classList.remove('order-3');
            positionPlayerOne.classList.add('order-1');

            positionPlayerTwo.classList.remove('order-1');
            positionPlayerTwo.classList.add('order-3');
        }
}

// shuffle the die
function shuffleArray(inputArray){
    inputArray.sort(()=> Math.random() - 0.5);
}

function setPlayersFct(){
    if ( !selectPlayerOne){
        selectPlayerOne = !selectPlayerOne;
        document.getElementById('playerOneName').focus();
        document.getElementById('playerOneName').disabled = false
        document.getElementById('playerTwoName').disabled = true;
        document.getElementById('setPlayers').innerText = 'Avatar one';
    }else{
        selectPlayerOne = !selectPlayerOne;
        document.getElementById('playerTwoName').focus();
        document.getElementById('playerOneName').disabled = true;
        document.getElementById('playerTwoName').disabled = false;
        document.getElementById('setPlayers').innerText = 'Avatar two';
    }

    if(indexAvatar > 0){
        swapPlayerFct();
    }
}

function avatarIdFct(){

    if ( indexAvatar == arrayAvatar.length - 1){
        indexAvatar = 0;
    }

    let  i = indexAvatar;

    let avatarList = document.getElementById('avatarId');
    
    var imageAvatar = document.createElement('img');
    indexOfFirst = arrayAvatar[i][0].indexOf('-');
    let valeur = arrayAvatar[i][0].substr(indexOfFirst + 1 ,2);

    imageAvatar.id = "avatarId" + "-" + valeur;
    imageAvatar.src = arrayAvatar[i][0];
  
  
    if (defaultTheme) {
        imageAvatar.className = 'img-fluid';
    }else{
        imageAvatar.className = 'img-fluid darkMode';
    }

    avatarId.innerHTML = '';
    avatarId.appendChild(imageAvatar);

   
    if (selectPlayerOne){
        var tt = document.getElementById('div1');
        var nom = document.getElementById('playerOneName');
        document.getElementById('playerOneName').focus();
        document.getElementById('playerTwoName').disabled = true;
        document.getElementById('playerOneName').disabled = false;
        avatarOneSelected=i;
    }else{
        var tt = document.getElementById('div2');
        var nom = document.getElementById('playerTwoName');
        document.getElementById('playerTwoName').focus();
        document.getElementById('playerTwoName').disabled = false;
        document.getElementById('playerOneName').disabled = true;   
        avatarTwoSelected=i;
    }

    if(avatarOneSelected !==  avatarTwoSelected){
        var imageAvatar = document.createElement('img');
        imageAvatar.id = ('imgIdAvatar-' + i);
        imageAvatar.src = arrayAvatar[i][0];
        if (defaultTheme) {
            imageAvatar.className = 'img-fluid';
        }else{
            imageAvatar.className = 'img-fluid darkMode';
        }
        tt.innerHTML='';
        tt.appendChild(imageAvatar);
        if (nom.value !== '') {
                if( arrayAvatarName.includes(nom.value) ){
                    indexOfFirst = imageAvatar.id.lastIndexOf('-');
                    let valeur = parseInt(imageAvatar.id.substr(indexOfFirst + 1 ,2));
                    nom.value = arrayAvatarName[valeur];
                }
        }else{
            indexOfFirst = imageAvatar.id.lastIndexOf('-');
            let valeur = parseInt(imageAvatar.id.substr(indexOfFirst + 1 ,2));
            nom.value = arrayAvatarName[valeur]
        }

    }

    indexAvatar ++;

}

function createPlayer(insert1, insert2, nom, globalScore, currentScore){
    let insertPoint = document.getElementById(insert1);
    let insertData = document.createElement('input');
    insertData.type = 'text';
    insertData.className = 'mt-2 form-control text-wrap defaultTheme';
    insertData.style.borderStyle = "none";
    insertData.style.textAlign = "center";
    insertData.style.fontSize = "1.3em";
    insertData.size = "9";
    insertData.id = nom;
    insertData.name = nom;
    insertData.placeholder = 'give a name';
    insertPoint.appendChild(insertData);
    
    insertData = document.createElement('div');
    insertData.id = globalScore;
    insertData.className = 'ombre borderCurved defaultTheme';
    insertPoint.appendChild(insertData);
    
    insertData = document.createElement('div');
    insertData.id = insert2;
    insertData.className = 'defaultTheme';
    insertPoint.appendChild(insertData);
   
    insertPoint = document.getElementById(insert1);
    insertData = document.createElement('div');
    insertData.id = currentScore;
    insertData.className = 'ombre borderCurved defaultTheme';
    insertPoint.appendChild(insertData);
}