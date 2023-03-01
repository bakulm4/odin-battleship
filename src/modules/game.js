import GameBoard from './gameboard-factory.js';
import Player from './player-factory.js';
import {update_cell} from './board_ui.js';
import {updateMessage,toggleBoardWait,gameOver} from './game_ui';
import './game_ui';

export default function Game(){
    let game_state='';
    let turn='';
    let message = '';
    let playerBoard = null;
    let opponentBoard = null;
    let player = null;
    let opponent = null;

    initialize();

    function initialize(){
        playerBoard = GameBoard(10,'player');
        opponentBoard = GameBoard(10,'opponent');
        player = Player('player');
        opponent = Player('opponent');
        game_state='place-ships';
        message = 'Place the ships.';
        opponentBoard.randomPlacement();
        updateMessage(message);
    }

    function resetGame(){
        game_state='place-ships';
        message = 'Place the ships.';
        playerBoard.resetBoard();
        opponentBoard.resetBoard();
        opponentBoard.randomPlacement();
        updateMessage(message);
    }

    function canStartGame(){
        //  console.log(`can Start Game, is player board Populated?`, playerBoard.isBoardPopulated());
        //  console.log(`can Start Game, is opponent board Populated?`, opponentBoard.isBoardPopulated());
        return opponentBoard.isBoardPopulated() && playerBoard.isBoardPopulated();
    }

    function placeShipOnBoard(type,ship,axis,coord,rotating){
        const board = type=== 'player' ? playerBoard : opponentBoard;
        return board.placeShip(ship,axis,coord,rotating);
    }

    function placeShipsRandomly(type){
        const board = type=== 'player' ? playerBoard : opponentBoard;
        board.randomPlacement();
    }

    function removeShipCoordinates(player,ship){
        const board = player === 'player' ? playerBoard : opponentBoard;
        board.removeShipCoordinates(ship);
    }

    function getShipCoordinates(type,ship){
        if(game_state ==='place-ships'){
            return playerBoard.getShipCoordinates(ship);
        }else{
            if(turn === type){
                const board = turn === 'player' ? playerBoard : opponentBoard;
                return board.getShipCoordinates(ship);
            }
        }
    }

    function startGame(){
        game_state='running';
        turn = 'player';
        message = 'Game started. Your turn.';
        updateMessage(message);
        // console.log(`Game.startGame. playerBoard coordinates: `, playerBoard.getShipCoordinates());
        // console.log(`Game.startGame. opponentBoard coordinates: `, opponentBoard.getShipCoordinates());
    }

    function toggleTurn(){
        turn = turn === 'player' ? 'opponent' :'player';
        toggleBoardWait(turn);
        if(turn === 'opponent'){
            // hit player's board
            message=`Opponent's turn.`;
            setTimeout(()=>{playTurn(null,null)},3000);
        }
        else{
            message=`Your turn`;
        }
        updateMessage(message);
    }

    function playTurn(coord){
        const board = turn === 'player'? opponentBoard : playerBoard;
        const playerType = turn === 'player'? player : opponent;
        const coordinates = turn === 'player'? coord : null;
        // console.log(`Game.playTurn: turn: ${turn}, attacking [${coordinates}]`);
        const result = playerType.attack(coordinates,board);
        if(result === 'miss')
            message = turn === 'player'? 'You missed.' : 'Opponent missed';
        else if(result === 'hit')
            message = turn === 'player'? 'You hit.' : 'Opponent hit.';
        else if(result.startsWith('sunk')){
            const ship = result.split(',')[1];
            message = turn === 'player'? `You sunk opponent's ${ship}` : `Opponent sunk your ${ship}.`;
        }
        updateMessage(message);
        
        // if(turn === 'player')   
        //     update_cell(coordinates,turn,result);

        if(board.areAllShipsSunk()){
            message = turn === 'player'? `Game Over. Congratulations you won!` : `Game over. You lose.`;
            game_state='finished';
            gameOver(turn);
            updateMessage(message);
        }else if(result === 'miss'){
            setTimeout(()=>toggleTurn(),1000);
        }else if(result ==='hit' || result.startsWith('sunk')){
            // setTimeout(()=>toggleTurn(),3000);
            setTimeout(()=>{updateMessage(`${turn === 'player' ? 'Your' : "Opponent's"} turn.`)},2000);
            (turn==='opponent') && setTimeout(()=>{playTurn(null,null)},4000);
        }
    }

    function resetBoard(type){
        const board = type === 'player' ? playerBoard : opponentBoard;
        board.resetBoard();
    }

    function getState(){
        return game_state;
    }

    // function getMessage(){
    //     return message;
    // }

    // function getBoard(type){
    //     return type==='player'? playerBoard : opponentBoard;
    // }

    function getTurn(){
        return turn;
    }

    // function getPlayer(){
    //     return player;
    // }

    return {
        initialize,
        resetGame,
        canStartGame,
        placeShipOnBoard,
        placeShipsRandomly,
        removeShipCoordinates,
        getShipCoordinates,
        startGame,
        resetBoard,
        getState,
        getTurn,
        playTurn,
    }
}