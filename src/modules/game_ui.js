import { ship_types } from "./gameboard-factory";

const notification_container = document.querySelector('.notification');
const notification_submit = document.querySelector('.notification-submit');
const message = document.querySelector('.notification-message');
const ships = document.querySelectorAll('[draggable="true"]');
const player_board_cells = document.querySelectorAll('.battlefield__self .battlefield-cell-content');
const rival_board_ui = document.querySelector('.battlefield__rival');
const rival_board_cells = rival_board_ui.querySelectorAll('.battlefield-cell-content');
const player_board_ui = document.querySelector('.battlefield__self');
const randomizeLink = document.querySelector('.placeships-variant.random');
const resetLink = document.querySelector('.placeships-variant.reset');
const play_button = document.querySelector('.battlefield-start-button');
const port = document.querySelector('.port');
const port_ships=port.querySelectorAll('.port-ship');
const battlefield_stats = document.querySelectorAll('.battlefield-stat');
const footer = document.querySelector('footer');
let _game;

export function setGame(game){
    _game = game;
}

function handleShipDragStart(event){
    event.currentTarget.style.opacity='0.4';
    event.dataTransfer.setData('text/plain',`${event.currentTarget.id},${event.currentTarget.dataset.axis},${event.currentTarget.dataset.ship}`);
    event.dataTransfer.effectAllowed= 'move';

   // console.log('Drag Start: Parent element: ', event.currentTarget.parentElement);
    if(event.currentTarget.parentElement.classList.contains('battlefield-cell-content')){
        //console.log('Remove ship data from currently occupied cells');
        const ship_coordinates = _game.getShipCoordinates('player',event.currentTarget.dataset.ship);
        //player_board.removeShipCoordinates(e.currentTarget.dataset.ship);
        _game.removeShipCoordinates('player',event.currentTarget.dataset.ship);

        ship_coordinates.forEach(coord=>{
            const element = document.querySelector(`[data-x="${coord[0]}"][data-y="${coord[1]}"]`);
            addRemoveShipDataFromCell(element,'',false);
        });
    }
}

function handleShipDrop(event){
    event.stopPropagation();
    event.preventDefault();
    //console.log('Dropping on ', event.currentTarget);
    // console.log(`Drop: this element:`, box);
    // console.log(`Drop event: Item's length and axis:`, e.dataTransfer.getData('text/plain'));
    const[id,axis,ship] = event.dataTransfer.getData('text/plain').split(',');
    const sourceNode = document.getElementById(id);
    const [x,y] = [parseInt(event.currentTarget.dataset.x),parseInt(event.currentTarget.dataset.y)];
    event.currentTarget.style.opacity='1';
    event.currentTarget.classList.remove('dragging');
    const rotating = false;

    //const placed_ship = player_board.placeShip(type,ship,axis,[x,y],rotating);
    const placed_ship = _game.placeShipOnBoard('player',ship,axis,[x,y],rotating);
    //console.log('Placed ship: ', placed_ship);

    if(placed_ship){
        //const ship_coordinates = player_board.getShipCoordinates(ship);
        const ship_coordinates = _game.getShipCoordinates('player',ship);
        //console.log(`Ship Coordinates: `, ship_coordinates);
        //console.log(`handleDrop: is player board populated? `, game.getBoard('player').isBoardPopulated());
        sourceNode.style.opacity='1';
        event.currentTarget.appendChild(sourceNode);

        ship_coordinates.forEach(coord=>{
            const element = document.querySelector(`[data-x="${coord[0]}"][data-y="${coord[1]}"]`);
            addRemoveShipDataFromCell(element,ship,true);
        });

        if(_game.canStartGame()){
            prepareForPlayStart();
        }
        (resetLink.classList.contains('inactive')) && resetLink.classList.remove('inactive');
    }
}

function handleShipDragEnter(event){
   
    event.preventDefault();
    event.dataTransfer.dropEffect='all';
    //console.log(`Entered [${event.currentTarget.dataset.x},${event.currentTarget.dataset.y}]`);
    if(event.currentTarget.dataset.ship && event.currentTarget.dataset.ship.length>0)
        return;
    event.currentTarget.style.opacity='0.4';
    event.currentTarget.classList.add('dragging');
}    

function handleShipDragEnd(event) {
    //console.log(`Drag End`)
    if(event.currentTarget.getAttribute('draggable')==='true')
        event.currentTarget.style.opacity='1';
}

function handleShipDragOver(event) {
    event.preventDefault();
    //console.log(`Drag Over: `, e.currentTarget);
    //e.target.style.opacity='1';
    event.dataTransfer.dropEffect='all';
    return false;
}

function handleShipDragLeave(event){
    //console.log(`Drag Left: `, e.currentTarget);
    //console.log(`Left [${event.currentTarget.dataset.x},${event.currentTarget.dataset.y}]`);
    event.currentTarget.style.opacity='1';
    event.currentTarget.classList.remove('dragging');
}

function handleShipClick(event){
    //console.log(`HandleClick, game state: `, _game.getState());
    if(_game.getState()==='place-ships'){
        if(event.currentTarget.parentElement.classList.contains('battlefield-cell-content')){
            const axis = event.currentTarget.dataset.axis === 'x'?'y':'x';
            const ship = event.currentTarget.dataset.ship;
            const [x,y] = [parseInt(event.currentTarget.parentElement.dataset.x),parseInt(event.currentTarget.parentElement.dataset.y)];
            const rotating = true;

            const current_coordinates = _game.getShipCoordinates('player',ship);
            //console.log(`RotateShip: current_coordinates: `, current_coordinates);
        
            const rotate_ship = _game.placeShipOnBoard('player',ship,axis,[x,y],rotating);
    
            if(rotate_ship){
                event.currentTarget.dataset.axis= axis;
                //const new_coordinates = player_board.getShipCoordinates(ship);
                const new_coordinates = _game.getShipCoordinates('player',ship);
                //console.log(`RotateShip: new_coordinates: `, new_coordinates);
                for(let i=1;i<new_coordinates.length;i++){
                    const new_element = document.querySelector(`[data-x="${new_coordinates[i][0]}"][data-y="${new_coordinates[i][1]}"]`);
                    addRemoveShipDataFromCell(new_element,ship,true);
                    const old_element = document.querySelector(`[data-x="${current_coordinates[i][0]}"][data-y="${current_coordinates[i][1]}"]`);
                    addRemoveShipDataFromCell(old_element,'',false);
                };
            }else {
                event.currentTarget.classList.add('error');
                setTimeout((node) => {
                    node.classList.remove('error');
                }, 1000,event.currentTarget);
            }
        }
    }else {
        e.currentTarget.classList.add('error');
        setTimeout((node) => {
            node.classList.remove('error');
        }, 1000,e.currentTarget);
    }

}

function addRemoveShipDataFromCell(cell,ship,add){
    if(add){
        cell.dataset.ship=ship;
        cell.parentElement.classList.remove('battlefield-cell__empty');
        cell.parentElement.classList.add('battlefield-cell__busy');
    }else{
        cell.dataset.ship='';
        cell.parentElement.classList.remove('battlefield-cell__busy');
        cell.parentElement.classList.add('battlefield-cell__empty');
    }
}

function prepareForPlayStart(){
    port.classList.add('none');
    rival_board_ui.classList.remove('none');
    play_button.classList.remove('none');
    updateMessage('Press the Play button to start the game.');
}

export function updateMessage(msg){
    message.innerText = msg;
}

function resetPlayerBusyCells(){
    const busy_cells = document.querySelectorAll('.battlefield-cell__busy');
    busy_cells.forEach(cell=>{
        const node = cell.querySelector('.battlefield-cell-content');
        node.dataset.ship='';
        cell.classList.remove('battlefield-cell__busy');
        cell.classList.add('battlefield-cell__empty');
    });
}

export function resetPlayerShips(){
    _game.resetBoard('player');

    const port_ships_arr = Array.from(port_ships);
    //console.log(`Port ship array: `, port_ships_arr);
    const ships_in_grid = document.querySelectorAll('.battlefield-cell-content .ship-box');
    //console.log(`Ships in grid: `, ships_in_grid);
    ships_in_grid.forEach(ship=>{
           ship.parentElement.removeChild(ship);
           ship.dataset.axis='x';
        const port_ship = port_ships_arr.find(portShip=>{
            //console.log(`Ship classlist: `, portShip.classList);
            return portShip.classList.contains(ship.dataset.ship)
        });
        port_ship.appendChild(ship);

    });

    resetPlayerBusyCells();
    port.classList.contains('none')&& port.classList.remove('none');
    !rival_board_ui.classList.contains('none') && rival_board_ui.classList.add('none');
    !play_button.classList.contains('none') && play_button.classList.add('none');
    !(resetLink.classList.contains('inactive')) && resetLink.classList.add('inactive');
    updateMessage('Place the ships.');
}

export function placePlayerShipsRandomly(){
    _game.placeShipsRandomly('player');
    resetPlayerBusyCells();

    Object.keys(ship_types).forEach(ship=>{
        //const ship_coords = player_board.getShipCoordinates(ship);
        const ship_coords = _game.getShipCoordinates('player',ship);
        const axis = ship_coords[0][0]=== ship_coords[ship_coords.length-1][0] ? 'y':'x';
        //console.log(`placeShipsRandomly: axis for ${ship} is ${axis}`);
        const shipElement = document.getElementById(ship);
        shipElement.dataset.axis = axis;
        const [x,y]= ship_coords[0];
        const grid_cell_to_place_ship = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        shipElement.parentElement.removeChild(shipElement);
        grid_cell_to_place_ship.appendChild(shipElement); 
        ship_coords.forEach(coord=>{
            const occupied_grid_cell = document.querySelector(`[data-x="${coord[0]}"][data-y="${coord[1]}"]`);
            occupied_grid_cell.dataset.ship=ship;
            occupied_grid_cell.parentElement.classList.remove('battlefield-cell__empty');
            occupied_grid_cell.parentElement.classList.add('battlefield-cell__busy');
        });  
    });

    (resetLink.classList.contains('inactive')) && resetLink.classList.remove('inactive');
    prepareForPlayStart();
}

export function startPlay(){
    _game.startGame();

    battlefield_stats.forEach(stat=> stat.classList.remove('none'));
    !(port.classList.contains('none')) && port.classList.add('none');
    rival_board_ui.classList.contains('none') && rival_board_ui.classList.remove('none');
    footer.classList.add('none');
    toggleBoardWait(_game.getTurn());
    // if(_game.getTurn() === 'player'){
    //     (rival_board_ui.classList.contains('battlefield__wait')) && rival_board_ui.classList.remove('battlefield__wait');
    //     !(player_board_ui.classList.contains('battlefield__wait')) && player_board_ui.classList.add('battlefield__wait');
    // }else{
    //     !(rival_board_ui.classList.contains('battlefield__wait'))&& rival_board_ui.classList.add('battlefield__wait');
    //     (player_board_ui.classList.contains('battlefield__wait'))&& player_board_ui.classList.remove('battlefield__wait');
    // }
}

function handleAttack(e){
    if(_game.getState()==='running' && _game.getTurn()==='player'){
        const coords = [parseInt(e.currentTarget.dataset.x),parseInt(e.currentTarget.dataset.y)];
        _game.playTurn(coords);
    }
}

export function toggleBoardWait(type){
    if(type==='player'){
        (rival_board_ui.classList.contains('battlefield__wait')) && rival_board_ui.classList.remove('battlefield__wait');
        !(player_board_ui.classList.contains('battlefield__wait')) && player_board_ui.classList.add('battlefield__wait');
    }else{
        !(rival_board_ui.classList.contains('battlefield__wait'))&& rival_board_ui.classList.add('battlefield__wait');
        (player_board_ui.classList.contains('battlefield__wait'))&& player_board_ui.classList.remove('battlefield__wait');
    }
}

export function gameOver(turn){
    notification_submit.classList.remove('none');
    if(turn==='player'){
        notification_container.classList.add('notification__game-over-win');
        notification_submit.value = 'Play again ';
    }
    else{
        notification_container.classList.add('notification__game-over-lose');
        notification_submit.value = 'Rematch';
    }
}

// export function resetNotification(){
//     notification_submit.classList.add('none');
//     (notification_container.classList.contains('notification__game-over-win')) && notification_container.classList.remove('notification__game-over-win');
//     (notification_container.classList.contains('notification__game-over-lose')) && notification_container.classList.remove('notification__game-over-lose');
// }

export function resetUI(){
    _game.resetGame();
    resetPlayerShips();
    const occupied_cells = document.querySelectorAll('.battlefield-cell__miss, .battlefield-cell__hit, .battlefield-cell__done');
    occupied_cells.forEach(cell=>{
        (cell.classList.contains('battlefield-cell__miss')) && cell.classList.remove('battlefield-cell__miss');
        (cell.classList.contains('battlefield-cell__hit')) && cell.classList.remove('battlefield-cell__hit');
        (cell.classList.contains('battlefield-cell__done')) && cell.classList.remove('battlefield-cell__done');
    });

    const killed_ships = document.querySelectorAll('.ship__killed');
    killed_ships.forEach(stat_ship=>{
         stat_ship.classList.remove('ship__killed');
    });

    notification_submit.classList.add('none');
    (notification_container.classList.contains('notification__game-over-win')) && notification_container.classList.remove('notification__game-over-win');
    (notification_container.classList.contains('notification__game-over-lose')) && notification_container.classList.remove('notification__game-over-lose');

    battlefield_stats.forEach(stat=> stat.classList.add('none'));
    !(rival_board_ui.classList.contains('battlefield__wait'))&& rival_board_ui.classList.add('battlefield__wait');
    (player_board_ui.classList.contains('battlefield__wait'))&& player_board_ui.classList.remove('battlefield__wait');
    footer.classList.remove('none');
}

rival_board_cells.forEach(cell=>{
    cell.addEventListener('click',handleAttack);
});

ships.forEach(item=>{
    item.addEventListener('dragstart',handleShipDragStart);
    item.addEventListener('dragend', handleShipDragEnd);
    item.addEventListener('click', handleShipClick);
});


player_board_cells.forEach(cell=>{
    cell.addEventListener('dragenter', handleShipDragEnter);
    cell.addEventListener('dragover', handleShipDragOver);
    cell.addEventListener('dragleave', handleShipDragLeave);
    cell.addEventListener('drop',handleShipDrop);
    
});

resetLink.addEventListener('click',resetPlayerShips);
randomizeLink.addEventListener('click',placePlayerShipsRandomly);
play_button.addEventListener('click',startPlay);
notification_submit.addEventListener('click',resetUI);