//Initialisation
const nbrImgAvatar = 10;
const logRollMax = 7;

let playerOneActif = Boolean(true);
let playerTwoActif = Boolean(false);
let playerOneGlobalScore = 0;
let playerTwoGlobalScore = 0;
let playerOneCurrentScore = 0;
let playerTwoCurrentScore = 0;
let nbrRollPlayerOne = 0;
let nbrRollPlayerTwo = 0;

let diceType = parseInt(document.getElementById('diceType').value);
let losingDiceFace = parseInt(document.getElementById('losingDiceFace').value);
let winningScore = parseInt(document.getElementById('winningScore').value);
let setSound=document.getElementById('setSound').checked;
let defaultTheme=document.getElementById('defaultTheme').checked;
let implicitWin = document.getElementById('implicitWin').checked;

// array contain path to avatar images 
let arrayAvatar=[];

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
    arrayAvatar.push(sourceAvatar);
};

// sort array to change order of avatars images on page load
shuffleArray(arrayAvatar);

// array for biggest possible die up to 12 sides
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
let rollLogPlayerOne = [];
let rollLogPlayerTwo = [];


// let btnSettingModal = document.getElementById('btnSettingModal');
// BUttons definition
let btnNewGame=document.getElementById('newGame');
btnNewGame.addEventListener('click',newGameFct);

let btnCancelGame=document.getElementById('cancelGame');
btnCancelGame.addEventListener('click',cancelGameFct);
btnCancelGame.disabled = true;

let btnRoll=document.getElementById('roll');
btnRoll.addEventListener('click',rollFct);
btnRoll.disabled = true;

let btnHold=document.getElementById('hold');
btnHold.addEventListener('click', holdFct);
btnHold.disabled = true;

// Inject avatars images in the list of choice, each of the image will have an id
let avatarList = document.getElementById('avatarList');
arrayAvatar.forEach(function(item, index, array) {
    var imageAvatar = document.createElement('img');
    imageAvatar.id = "avatarId" + "-" + index;
    imageAvatar.src = item;
    if (defaultTheme) {
        imageAvatar.className = "img-fluid";
    }else{
        imageAvatar.className = "img-fluid darkMode";
    }
    avatarList.appendChild(imageAvatar);
  });

//   Array to manage what avatar is choosen, the aim is to avoid the same choice for the two players
let avatarClick=[];

// no avatar choosen for any player
let avatarOneSelected='99';
let avatarTwoSelected='99';

// Make avatar clickable, when an avatar is clicked, assign the image to the actif player
// only if his choice is different from the other player
for (let i=0; i < 10; i++){
    let idOne="avatarId-"+i;
    avatarClick.push(document.getElementById(idOne));
    avatarClick[i].addEventListener('click',function(){

        if ((avatarOneSelected !== i) && (avatarTwoSelected !== i)){
            if (playerOneActif){
                avatarOneSelected=i;
                var tt=document.getElementById('playerOne');
            }else{
                avatarTwoSelected=i;
                var tt=document.getElementById('playerTwo');
            }

            var imageAvatar = document.createElement('img');
            imageAvatar.id = ('imgIdAvatar-' + i);
            imageAvatar.src = arrayAvatar[i];
            imageAvatar.className = "img-fluid";
            tt.innerHTML='';
            tt.appendChild(imageAvatar);
            playerOneActif =! playerOneActif;
            playerTwoActif =! playerTwoActif;
        }
    });
}

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
    elmtBody = document.getElementById('body');
    elmtMain = document.getElementById('main');
    elmtSettingModal=document.getElementById('settingModalContent');
    elmtRuleModal=document.getElementById('checkRulesContent');

    if (isNaN(diceType) || isNaN(losingDiceFace) || isNaN(winningScore)){
        alert('Au moins un paramètre n"est pas numérique, vos modifications ne seront pas prises en ncompte pour cette partie.')
        diceType = 6;
        losingDiceFace = 1;
        winningScore = 100;
    }

    if (diceType < 1 || diceType > 12  || losingDiceFace < 1 || losingDiceFace > diceType || winningScore < 1){
        alert('Le nombre de faces du dé doit être compris entre 1 et 12, et la face perdante doit être comprise en 1 et le nombre de faces. '
        + ' le score gagnant doit être supérieur ou égal à 1.'
        + 'Vos indications ' + diceType + ' / ' + losingDiceFace + ' / ' + winningScore 
        + ' ne semblent pas respecter ces contraintes. '
        + 'Les valeurs par défaut 6, 1 et 100, seront donc maintenues pour cette partie.')
        diceType = 6;
        losingDiceFace = 1;
        winningScore = 100;
    }

    if (defaultTheme){
        elmtBody.classList.remove('darkMode');
        elmtBody.classList.add('defaultTheme');
        elmtMain.classList.remove('darkMode');
        elmtMain.classList.add('defaultTheme');
        elmtSettingModal.classList.remove('darkMode');
        elmtSettingModal.classList.add('defaultTheme');
        elmtRuleModal.classList.remove('darkMode');
        elmtRuleModal.classList.add('defaultTheme');
        document.getElementById('playerOneName').classList.remove('darkMode');
        document.getElementById('playerOneName').classList.add('defaultTheme');
        document.getElementById('playerTwoName').classList.remove('darkMode');
        document.getElementById('playerTwoName').classList.add('defaultTheme');
        document.getElementById('diceType').classList.remove('darkMode');
        document.getElementById('diceType').classList.add('defaultTheme');
        document.getElementById('losingDiceFace').classList.remove('darkMode');
        document.getElementById('losingDiceFace').classList.add('defaultTheme');
        document.getElementById('winningScore').classList.remove('darkMode');
        document.getElementById('winningScore').classList.add('defaultTheme');
    }else{
        elmtBody.classList.remove('defaultTheme');
        elmtBody.classList.add('darkMode');
        elmtMain.classList.remove('bg-light');
        elmtMain.classList.add('darkMode');
        elmtSettingModal.classList.remove('defaultTheme');
        elmtSettingModal.classList.add('darkMode');
        elmtRuleModal.classList.remove('defaultTheme');
        elmtRuleModal.classList.add('darkMode');
        document.getElementById('playerOneName').classList.remove('defaultTheme');
        document.getElementById('playerOneName').classList.add('darkMode');
        document.getElementById('playerTwoName').classList.remove('defaultTheme');
        document.getElementById('playerTwoName').classList.add('darkMode');
        document.getElementById('diceType').classList.remove('defaultTheme');
        document.getElementById('diceType').classList.add('darkMode');
        document.getElementById('losingDiceFace').classList.remove('defaultTheme');
        document.getElementById('losingDiceFace').classList.add('darkMode');
        document.getElementById('winningScore').classList.remove('defaultTheme');
        document.getElementById('winningScore').classList.add('darkMode');
    }

})

// function link to play button
// Initialization of scores, number of rolls, rolls log and force player one to be active
// maybe during the previous run, player have been swap as a result, new swap to establish default players positions
function newGameFct(){

    nbrRollPlayerOne = 0;
    nbrRollPlayerTwo = 0;
    document.getElementById('rollLogPlayerOne').innerHTML = '';
    document.getElementById('rollLogPlayerTwo').innerHTML = '';
    playerOneActif = Boolean(true);
    playerTwoActif = Boolean(false);

    if ( positionPlayerOne.classList.contains('order-3')) {

        positionPlayerOne.classList.remove('order-3');
        positionPlayerOne.classList.add('order-1');

        positionPlayerTwo.classList.remove('order-1');
        positionPlayerTwo.classList.add('order-3');

        // document.getElementById('rollLogPlayerOne').classList.remove('order-2');
        // document.getElementById('rollLogPlayerOne').classList.add('order-1');

        // document.getElementById('rollLogPlayerTwo').classList.remove('order-1');
        // document.getElementById('rollLogPlayerTwo').classList.add('order-2');
    }


    //maybe dice type has change (by modal setting) from the previous run, so that die dimension is apply
    arrayDiceFaces = arrayDiceDodecagone.slice (0, diceType);

    // the two players must choose an avatar before game starting
    if ((avatarOneSelected != 99) && (avatarTwoSelected != 99)){
        btnNewGame.disabled = true;
        btnCancelGame.disabled = false;
        btnRoll.disabled = false;
        btnSettingModal.disabled = true;
        document.getElementById('playerOneName').disabled = true;
        document.getElementById('playerTwoName').disabled = true;

        var tt=document.getElementById('dice');
        tt.innerHTML = '';

        loosingDiceFace = 0;
        playerOneActif = Boolean(true);
        playerTwoActif = Boolean(false);
        playerOneGlobalScore = 0;
        playerTwoGlobalScore = 0;
        playerOneCurrentScore = 0;
        playerTwoCurrentScore = 0;

        tt=document.getElementById('playerOneGlobalScore');
        tt.innerText='Global Score ' + playerOneGlobalScore;
        tt=document.getElementById('playerOneCurrentScore');
        tt.innerText='Current Score ' + playerOneCurrentScore;

        tt=document.getElementById('playerTwoGlobalScore');
        tt.innerText='Global Score ' + playerTwoGlobalScore;
        tt=document.getElementById('playerTwoCurrentScore');
        tt.innerText='Current Score ' + playerTwoCurrentScore;

        tt=document.getElementById('avatarId');
        tt.classList.add('d-none');
      
    }else{
        alert('Two avatars must be selected, before game starting. You can set a cutomized name to each player.')
    }
}

function cancelGameFct(){

    playerOneActif = Boolean(true);
    playerTwoActif = Boolean(false);
    playerOneGlobalScore = 0;
    playerTwoGlobalScore = 0;
    playerOneCurrentScore = 0;
    playerTwoCurrentScore = 0;
    document.getElementById('playerOneName').disabled = false;
    document.getElementById('playerTwoName').disabled = false;

    tt=document.getElementById('playerOneGlobalScore');
    tt.innerText='Global Score ' + playerOneGlobalScore;
    tt=document.getElementById('playerOneCurrentScore');
    tt.innerText='Current Score ' + playerOneCurrentScore;

    tt=document.getElementById('playerTwoGlobalScore');
    tt.innerText='Global Score ' + playerTwoGlobalScore;
    tt=document.getElementById('playerTwoCurrentScore');
    tt.innerText='Current Score ' + playerTwoCurrentScore;

    btnRoll.disabled = true;
    btnHold.disabled = true;
    btnNewGame.disabled = false;
    btnCancelGame.disabled = true;
    btnSettingModal.disabled = false;

    // avatars images are visible again, so that players can choose an other one before the new game

    // var tt=document.getElementById('avatarId');
    // tt.classList.remove('d-none');
    
    // var tt=document.getElementById('dice');
    // tt.innerHTML = '';

    // document.getElementById('rollLogPlayerOne').innerHTML = '';
    // document.getElementById('rollLogPlayerTwo').innerHTML = '';

    document.getElementById('avatarId').classList.remove('d-none');

    // clean up dice track and rolls log
    document.getElementById('dice').innerHTML = '';
    document.getElementById('rollLogPlayerOne').innerHTML = '';
    document.getElementById('rollLogPlayerTwo').innerHTML = '';
}

// Function assign to keep button
// 
function holdFct(){

    // to avoid activate hold button without roll first
    btnHold.disabled = true;
    
    // apply and display updated scores
    if (playerOneActif){
        playerOneGlobalScore += playerOneCurrentScore;
        playerOneCurrentScore = 0;
        tt=document.getElementById('playerOneGlobalScore');
        tt.innerText='Global Score ' + playerOneGlobalScore;
        tt=document.getElementById('playerOneCurrentScore');
        tt.innerText='Current score ' + playerOneCurrentScore;
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
        if (playerOneActif) {
            para.innerText = document.getElementById('playerOneName').value + ', vous avez gagné !';
        }else{
            para.innerText = document.getElementById('playerTwoName').value + ', vous avez gagné !';
        }
        
        btnRoll.disabled = true;
        btnNewGame.disabled = false;

    // }else{
    //     swapPlayerFct();
    }
    
    // 
    swapPlayerFct();
    playerOneActif =! playerOneActif;
    playerTwoActif =! playerTwoActif;
    
    
}

function rollFct(){
    // let the possibility to the player to keep his score
    btnHold.disabled = false;

    // dice roll simulation with shuffle array containing die sides, choose the side to expose
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
    if (playerOneActif){ 

        tt = document.getElementById('rollLogPlayerOne');
        image = 'idLogPlayerOne-' + nbrRollPlayerOne;
        elthisto = document.createElement('img');
        elthisto.src = arrayDiceFaces[0];
        elthisto.className = "float-left";
        elthisto.id = image;
        elthisto.width = "30";
        elthisto.height = "30";
            
        tt.appendChild(elthisto);

        // For correct display on smaller screen, roll log list is limited to the constant logRollMax
        // so in case of oveflow, the older roll is erased of the log
        if ( nbrRollPlayerOne > logRollMax){
            index = parseInt(nbrRollPlayerOne - logRollMax - 1);
            image = 'idLogPlayerOne-' + index
            elt=document.getElementById(image)
            tt.removeChild(elt);
        }

        nbrRollPlayerOne ++;

    }else{
       
        tt = document.getElementById('rollLogPlayerTwo');
        image = 'idLogPlayerTwo-' + nbrRollPlayerTwo;
        elthisto = document.createElement('img');
        elthisto.src = arrayDiceFaces[0];
        elthisto.className = "float-left";
        elthisto.id = image;
        elthisto.width = "30";
        elthisto.height = "30";
        
        tt.appendChild(elthisto);

        if ( nbrRollPlayerTwo > logRollMax){
            index = parseInt(nbrRollPlayerTwo - logRollMax - 1);
            image = 'idLogPlayerTwo-' + index
            elt=document.getElementById(image)
            tt.removeChild(elt);
        }

        nbrRollPlayerTwo ++;

    }
    
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

    let virtualWinningScore = 0;

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
    // to proceed to evaluation, global score is considered, otherwise click hold button is required to
    // take into account the current score
    let test = 0;
    if (implicitWin){
        // alert('cas implicitwin vrai');
        test = virtualWinningScore;
    }else{
        // alert('cas implicitwin faux');
        test = score;
    }
    if (test >= winningScore){
        if (setSound){
            new Audio('/sounds/win.mp3').play();
        }

        let para = document.getElementById('dice');

        if (playerOneActif) {
            para.innerText = document.getElementById('playerOneName').value + ', you win !';
        }else{
            para.innerText = document.getElementById('playerTwoName').value + ', you win !';
        }
      
        btnRoll.disabled = true;
        btnHold.disabled = true;
        btnNewGame.disabled = false;
        btnSettingModal.disabled = false;
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

            document.getElementById('rollLogPlayerOne').classList.remove('order-1');
            document.getElementById('rollLogPlayerOne').classList.add('order-2');

            document.getElementById('rollLogPlayerTwo').classList.remove('order-2');
            document.getElementById('rollLogPlayerTwo').classList.add('order-1');
         
        }else{

            positionPlayerOne.classList.remove('order-3');
            positionPlayerOne.classList.add('order-1');

            positionPlayerTwo.classList.remove('order-1');
            positionPlayerTwo.classList.add('order-3');

            document.getElementById('rollLogPlayerOne').classList.remove('order-2');
            document.getElementById('rollLogPlayerOne').classList.add('order-1');

            document.getElementById('rollLogPlayerTwo').classList.remove('order-1');
            document.getElementById('rollLogPlayerTwo').classList.add('order-2');
        }
}
function shuffleArray(inputArray){
    inputArray.sort(()=> Math.random() - 0.5);
}
