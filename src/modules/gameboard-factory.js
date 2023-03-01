import Ship from "./ship-factory.js";
import place_ships from "./ship-placement.js";
import {update_cell} from './board_ui.js';


export const ship_types = {
    'carrier':5,
    'battleship':4,
    'destroyer':3,
    'submarine':3,
    'patrol':2
}

export default function GameBoard(grid_size,playerType){

    const shipCoordinates = {};
    let occupiedSpots = {
        'carrier':[],
        'battleship':[],
        'destroyer':[],
        'submarine':[],
        'patrol':[]
    };

    Object.keys(ship_types).forEach(key=>{
        shipCoordinates[key]={
            'shipObj':Ship({name:key,length:ship_types[key]}),
            'coords':[]
        };
    });


    let missedCoords = [];
    let hitCoords = [];

    function placeShip(type,axis,startingCoord=shipCoordinates[type].coords[0],rotate){
 
        //console.log(`Gameboard[${playerType}], placeship ${type}, axis: ${axis}, starting: [${startingCoord[0]},${startingCoord[1]}]`);
        const success = populateShipCoordinates(type,ship_types[type],axis,startingCoord,rotate);
        //console.log(`Gameboard[${playerType}] PlaceShip: coordinate length of ${type}: `,shipCoordinates[type].coords.length );
        return success;
    }

    function populateShipCoordinates(type,length,axis,startingCoord,rotate){
       // console.log(`Gameboard[${playerType}], populateShipCoordinates ${type}, length: ${length} axis: ${axis}, starting: [${startingCoord[0]},${startingCoord[1]}]`);

        let coordinates = [];
        let surroundingCells = []; 
        //Remove any current occupied spots for the ship, but save them in case ship can't be placed in new coordinate.
        const old_occupied_spots_for_ship = occupiedSpots[type];
        occupiedSpots[type] = [];

        if(axis === 'y'){
            for(let i=0;i<length;i+=1 ){
                //coordinates = coordinates.concat([[startingCoord[0],startingCoord[1]+i]])
                coordinates.push([startingCoord[0],startingCoord[1]+i]);

                //Populate surrounding cells.
                if(i=== 0 && startingCoord[1]-1>=0 ){
                    //put the cell directly above the first cell
                    surroundingCells.push([startingCoord[0],startingCoord[1]-1]);
                     //put the cell diagonally to the left of the first cell
                    (startingCoord[0]-1>=0)&& surroundingCells.push([startingCoord[0]-1,startingCoord[1]-1]);
                     //put the cell diagonally to the right of the first cell
                    (startingCoord[0]+1<=9)&& surroundingCells.push([startingCoord[0]+1,startingCoord[1]-1]);
                    
                }else if(i===length-1 &&  startingCoord[1]+i+1<=9){
                    //put the cell directly below the last cell
                    surroundingCells.push([startingCoord[0],startingCoord[1]+i+1]);
                     //put the cell diagonally to the left of the last cell
                    (startingCoord[0]-1>=0)&& surroundingCells.push([startingCoord[0]-1,startingCoord[1]+i+1]);
                     //put the cell diagonally to the right of the last cell
                    (startingCoord[0]+1<=9)&& surroundingCells.push([startingCoord[0]+1,startingCoord[1]+i+1]);
                }

                //Put cells to the left and right of current cell
                (startingCoord[0]-1>=0)&& surroundingCells.push([startingCoord[0]-1,startingCoord[1]+i]);
                (startingCoord[0]+1<=9)&& surroundingCells.push([startingCoord[0]+1,startingCoord[1]+i]);
            }
        }else if(axis === 'x'){
            for(let i=0;i<length;i+=1 ){
                //coordinates = coordinates.concat([[startingCoord[0]+i,startingCoord[1]]])
                coordinates.push([startingCoord[0]+i,startingCoord[1]]);

                 //Populate surrounding cells.
                 if(i=== 0 && startingCoord[0]-1>=0 ){
                    //put the cell to the left the first cell
                    surroundingCells.push([startingCoord[0]-1,startingCoord[1]]);
                     //put the cell diagonally above the first cell
                    (startingCoord[1]-1>=0)&& surroundingCells.push([startingCoord[0]-1,startingCoord[1]-1]);
                     //put the cell diagonally below the first cell
                    (startingCoord[1]+1<=9)&& surroundingCells.push([startingCoord[0]-1,startingCoord[1]+1]);
                    
                }else if(i===length-1 &&  startingCoord[0]+i+1<=9){
                    //put the cell to the right of the last cell
                    surroundingCells.push([startingCoord[0]+i+1,startingCoord[1]]);
                     //put the cell diagonally above the last cell
                    (startingCoord[1]-1>=0)&& surroundingCells.push([startingCoord[0]+i+1,startingCoord[1]-1]);
                     //put the cell diagonally below the last cell
                    (startingCoord[1]+1<=9)&& surroundingCells.push([startingCoord[0]+i+1,startingCoord[1]+1]);
                }

                //Put cells above and below the current cell
                (startingCoord[1]-1>=0)&& surroundingCells.push([startingCoord[0]+i,startingCoord[1]-1]);
                (startingCoord[1]+1<=9)&& surroundingCells.push([startingCoord[0]+i,startingCoord[1]+1]);
            } 
        }
        // console.log(`Gameboard[${playerType}]: Coordinates to check: `, coordinates);
        // console.log(`Gameboard[${playerType}]: surrounding cells: `, surroundingCells);
        const can_place_ship = rotate? canPlaceShip(coordinates.slice(1)): canPlaceShip(coordinates);
    

        //console.log(`Gameboard[${playerType}]: CanPlaceShip returned: `,can_place_ship );
        if(can_place_ship){
            shipCoordinates[type].coords = coordinates;
            occupiedSpots[type] = occupiedSpots[type].concat(coordinates,surroundingCells);
            return true;
        }
        //Ship can't be placed in new coordinate. Restore any old occupied spots for ship.
        occupiedSpots[type] = old_occupied_spots_for_ship;
        return false;
    }

    function canPlaceShip(coordinates){
        //console.log(`Gameboard: Coordinates to check: `, coordinates);
        const occupied_spots = Object.values(occupiedSpots).reduce((prev,cur)=>prev.concat(cur),[]);
        //console.log(`Gameboard, canPlaceShip, occupiedSpots`, occupied_spots);
        return coordinates.every(spot=>{
            //console.log(`Gameboard, canPlaceShip, spot: `, spot);
            return !occupied_spots.some(occSpot=> {
                //console.log(`Gameboard, canPlaceShip, occupied spot: `, occSpot);
                return (occSpot[0]===spot[0]&& occSpot[1]===spot[1])
            }) && 
            spot[0]>=0 && spot[0]< grid_size &&
            spot[1]>=0 && spot[1]< grid_size
        }); 
    }

    function receiveAttack(coord){

        let hit_status = 'miss';
        const auto_missed_coords = new Set();

        if(hitCoords.some(entry => entry[0]===coord[0]&& entry[1]===coord[1])||
            missedCoords.some(entry => entry[0]===coord[0]&& entry[1]===coord[1]))
            return 'already_tried';

        for(const value of Object.values(shipCoordinates)){
           
            if(value.coords.some(spot => {
                return spot[0]===coord[0]&& spot[1]===coord[1];
            })){
                value.shipObj.hit();
                hit_status='hit';
                //console.log(`Board.receiveAttack: ${playerType}'s ${value.shipObj.getName()} was hit `);
                hitCoords.push(coord);
                //push coordinates diagonal to current spot to missedCoords
                if(coord[0]-1 >= 0 ){
                    (coord[1]-1 >= 0 && !(missedCoords.some(entry => entry[0]===coord[0]-1&& entry[1]===coord[1]-1)))&& auto_missed_coords.add([coord[0]-1,coord[1]-1]);
                    (coord[1]+1 < grid_size && !(missedCoords.some(entry => entry[0]===coord[0]-1&& entry[1]===coord[1]+1))) && auto_missed_coords.add([coord[0]-1,coord[1]+1]);
                }
                if(coord[0]+1 < grid_size ){
                    (coord[1]-1 >= 0 && !(missedCoords.some(entry => entry[0]===coord[0]+1&& entry[1]===coord[1]-1))) && auto_missed_coords.add([coord[0]+1,coord[1]-1]);
                    (coord[1]+1 < grid_size && !(missedCoords.some(entry => entry[0]===coord[0]+1&& entry[1]===coord[1]+1))) && auto_missed_coords.add([coord[0]+1,coord[1]+1]);
                }

                if(value.shipObj.isSunk()){
                    hit_status = `sunk,${value.shipObj.getName()}`;
                  
                    //put the cell left of starting coordinate of ship to missedCoords if it is not already marked missed. 
                    (value.coords[0][0]-1 >=0 && !(missedCoords.some(entry => entry[0]=== value.coords[0][0]-1 && entry[1]=== value.coords[0][1]))) && auto_missed_coords.add([value.coords[0][0]-1,value.coords[0][1]]);
                    //put the cell above the starting coordinate of ship to missedCoords if it is not already there.
                    (value.coords[0][1]-1 >=0 && !(missedCoords.some(entry => entry[0]=== value.coords[0][0] && entry[1]=== value.coords[0][1]-1))) && auto_missed_coords.add([value.coords[0][0],value.coords[0][1]-1]);
                    //put the cell right of ending coordinate of ship to missedCoords if it is not already there. 
                    (value.coords[value.coords.length-1][0]+1 <grid_size && !(missedCoords.some(entry => entry[0]=== value.coords[value.coords.length-1][0]+1 && entry[1]=== value.coords[value.coords.length-1][1]))) && auto_missed_coords.add([value.coords[value.coords.length-1][0]+1,value.coords[value.coords.length-1][1]]);
                    //put the cell below the ending coordinate of ship to missedCoords if it is not already there.
                    (value.coords[value.coords.length-1][1]+1 <grid_size && !(missedCoords.some(entry => entry[0]=== value.coords[value.coords.length-1][0] && entry[1]=== value.coords[value.coords.length-1][1]+1))) && auto_missed_coords.add([value.coords[value.coords.length-1][0],value.coords[value.coords.length-1][1]+1]);

                    value.coords.forEach(coord=>update_cell(coord,playerType,hit_status));
                }
                break;
            }   
        }

        //console.log(`Board ${playerType}.receiveAttack: Auto missed coords: `, auto_missed_coords);
        auto_missed_coords.forEach(coord=>{
            update_cell(coord,playerType,"miss");
            missedCoords.push(coord);
        });

        (hit_status === 'miss') && missedCoords.push(coord);
        update_cell(coord,playerType,hit_status);
        return hit_status;
    }

    function areAllShipsSunk(){
        return Object.values(shipCoordinates).every(ship=>ship.shipObj.isSunk())
    }

    function getShipCoordinates(type){
        //console.log(`Gameboard[${playerType}] getShipCoordinates: shipCoordinates: `, shipCoordinates);
        if(type)
            return shipCoordinates[type].coords;
        else
            return shipCoordinates;
    }

    function removeShipCoordinates(type){
        //console.log(`Gameboard[${playerType}] removeShipCoordinates[${type}] called`);
        shipCoordinates[type].coords=[];
    }

    function resetBoard(){
        Object.values(shipCoordinates).forEach(ship=>{
            ship.coords=[];
            ship.shipObj.reset();
        });
        Object.keys(occupiedSpots).forEach(key=>{
            occupiedSpots[key]=[];
        });
        hitCoords = [];
        missedCoords = [];
    }

    function randomPlacement(){
        Object.entries(place_ships(grid_size)).forEach(([key,value])=>{
            //console.log(`Gameboard[${playerType}] randomPlacement: key - ${key}, value: `, value);
            shipCoordinates[key].coords = value;        
        });
        //console.log(`Board.randomPlacement: ${playerType}'s ship coordinates are:`, shipCoordinates);
    }

    function isBoardPopulated(){
           return Object.keys(ship_types).every(type=>{
            //console.log(`Gameboard[${playerType}] isBoardPopulated, ${type} length : ${ship_types[type]}  and coordinate length: `,shipCoordinates[type].coords.length );
            return shipCoordinates[type].coords.length === ship_types[type];
        });
    }

    function getMissedCoords(){
        return missedCoords;
    }

    return {
        placeShip,
        receiveAttack,
        areAllShipsSunk,
        getShipCoordinates,
        removeShipCoordinates,
        resetBoard,
        randomPlacement,
        isBoardPopulated,
        getMissedCoords
    }

}
