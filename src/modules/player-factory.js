import {update_cell} from './board_ui.js';

export default function Player(type){
    const attackedSpots = [];
    const missedSpots = [];
    const autoMissedSpots = [];
    let lastHitCoordStart = null;
    let lastHitCoordEnd = null;
    let axis = null;
    let spotsToTry = [];

    function attack(coord=null,board){
        
        //If player clicked on a spot they have already clicked on before.
        const already_tried_spots = attackedSpots.concat(missedSpots.concat(autoMissedSpots));
        //(type === 'opponent') && console.log(`Player ${type} attack, already tried spots: `, already_tried_spots);
        if(coord && coord.length> 0 && already_tried_spots.some(spot => spot[0]===coord[0]&& spot[1]===coord[1]))
            return 'already_tried';

        let coordToHit = coord ? coord : null;

        if(type === 'opponent'){
        
            if(lastHitCoordStart !== null){
                const spotsToTryCopy = [...spotsToTry];
                //console.log(`Player ${type}, spotsToTry:`, spotsToTryCopy);
                //coordToHit = spotsToTry.shift();
                coordToHit = spotsToTry[Math.floor(Math.random()*(spotsToTry.length))];
                spotsToTry = spotsToTry.filter(spot=>!(spot[0]=== coordToHit[0]&& spot[1]=== coordToHit[1]));
                //console.log(`Player opponent spotsToTry after choosing [${coordToHit}]:`,[...spotsToTry]);
            }
            else{
                coordToHit = [Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
                    while(already_tried_spots.some(spot=>spot[0]=== coordToHit[0]&&spot[1]=== coordToHit[1])){
                            coordToHit = [Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
                    }
            }
            //console.log(`Player: oppponent attacking: lastHitCoordStart: [${lastHitCoordStart}], lastHitCoordEnd: [${lastHitCoordEnd}], spotsToTry: [${spotsToTry}], coordtoHit: [${coordToHit}]`)
        }
        //console.log(`Player.attack: player ${type}, attacking [${coordToHit}]`);

        const result = board.receiveAttack(coordToHit);
        //update_cell(coordToHit,type,result);
        if(type==='opponent'){

            if(result.startsWith('sunk')){
                attackedSpots.push(coordToHit);
                (axis === null) && (axis = lastHitCoordStart[0] === coordToHit[0] ? 'y' : 'x');

                addDiagonalSpotsToAttackedList(coordToHit);
                addEndSpotsToAttackedList(coordToHit,lastHitCoordStart,lastHitCoordEnd,axis);
                
                //console.log(`Player opponent attack. Opponent sunk ship. Set spotsToTry to null`);
                //console.log('Opponent attacked. Opponent sunk ship. Attacked Spots: %0, Auto missed spots: %0', attackedSpots,autoMissedSpots);
                spotsToTry = [];
                lastHitCoordEnd = lastHitCoordStart = null;
                axis = null; 

            } else if(result==='hit'){
                attackedSpots.push(coordToHit);
                // add spots diagonal to current coord to attackedSpots.
                addDiagonalSpotsToAttackedList(coordToHit);

                //if I have had a hit before but not followed by a sunk and my current result is also a hit
                if(lastHitCoordStart !== null){
                    //If I didn't know the axis of the hit ship
                    //console.log(`Player opponent attack: hit [${lastHitCoordStart}] before and [${coordToHit}] to hit is a hit `);
                    if(axis === null){
                        axis = lastHitCoordStart[0] === coordToHit[0] ? 'y' : 'x';
                        //console.log(`Player opponent attack: axis: ${axis}`);
                        spotsToTry = axis === 'x' ?
                                    spotsToTry = spotsToTry.filter(spot => spot[1]===coordToHit[1]) :
                                    spotsToTry = spotsToTry.filter(spot => spot[0]===coordToHit[0]);
                        //console.log(`Player opponent attack: Filtered spots to try based on axis: [${spotsToTry}]`);
                    } 
                    if(axis === 'x'){
                        //Add the spot to the left of the current spot if I hit to the left of previous start.
                        if(coordToHit[0]<lastHitCoordStart[0]){
                            //console.log(`Player opponent attack: [${coordToHit}] is to left of [${lastHitCoordStart}], so add the spot to left of [${coordToHit}] to spots to Try. `);
                            lastHitCoordStart[0] = coordToHit[0];
                            (lastHitCoordStart[0]-1 >=0 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0]-1 && spot[1]=== lastHitCoordStart[1])) && spotsToTry.push([lastHitCoordStart[0]-1,lastHitCoordStart[1]]);
                            //console.log(`Player opponent attack: spotsToTry should contains [${lastHitCoordStart[0]-1},${lastHitCoordStart[1]}] if it's within range and not already tried: `, [...spotsToTry]);
                        }
                        //Add the spot to the right of the current spot if I hit to the right of previous end.
                        else if(coordToHit[0]>lastHitCoordEnd[0]){
                            //console.log(`Player opponent attack: [${coordToHit}] is to right of [${lastHitCoordEnd}], so add the spot to right of [${coordToHit}] to spots to Try. `);
                            lastHitCoordEnd[0] = coordToHit[0];
                            (lastHitCoordEnd[0]+1 <=9 && !already_tried_spots.some(spot => spot[0]===lastHitCoordEnd[0]+1 && spot[1]=== lastHitCoordEnd[1])) && spotsToTry.push([lastHitCoordEnd[0]+1,lastHitCoordEnd[1]]);     
                            //console.log(`Player opponent attack: spotsToTry should contains [${lastHitCoordEnd[0]+1},${lastHitCoordEnd[1]}] if it's within range and not already tried: `, [...spotsToTry]);
                        }
                    }else if(axis === 'y'){
                        //Add the spot to the top of the current spot if I hit the top of previous start.
                        if(coordToHit[1]<lastHitCoordStart[1]){
                            //console.log(`Player opponent attack: [${coordToHit}] is above [${lastHitCoordStart}], so add the spot above [${coordToHit}] to spots to Try. `);
                            lastHitCoordStart[1] = coordToHit[1];
                            (lastHitCoordStart[1]-1 >= 0 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0] && spot[1]=== lastHitCoordStart[1]-1)) && spotsToTry.push([lastHitCoordStart[0],lastHitCoordStart[1]-1]);
                            //console.log(`Player opponent attack: spotsToTry should contains [${lastHitCoordStart[0]},${lastHitCoordStart[1]-1}] if it's within range and not already tried: `, [...spotsToTry]);
                        }
                        //Add the spot to the bottom of the current spot if I hit the below of previous end and if it's not already hit.
                        else if(coordToHit[1]>lastHitCoordEnd[1]){
                            //console.log(`Player opponent attack: [${coordToHit}] is below [${lastHitCoordEnd}], so add the spot below [${coordToHit}] to spots to Try. `);
                            lastHitCoordEnd[1] = coordToHit[1];
                            (lastHitCoordEnd[1]+1 <= 9 && !already_tried_spots.some(spot => spot[0]===lastHitCoordEnd[0] && spot[1]=== lastHitCoordEnd[1]+1)) && spotsToTry.push([lastHitCoordEnd[0],lastHitCoordEnd[1]+1]);
                            //console.log(`Player opponent attack: spotsToTry should contains [${lastHitCoordEnd[0]},${lastHitCoordEnd[1]+1}] if it's within range and not already tried: `, [...spotsToTry]);
                        }
                    }

                }else{
                    lastHitCoordStart = [...coordToHit];
                    lastHitCoordEnd = [...coordToHit];
                    (lastHitCoordStart[0]-1 >= 0 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0]-1 && spot[1]=== lastHitCoordStart[1])) && spotsToTry.push([lastHitCoordStart[0]-1,lastHitCoordStart[1]]);
                    (lastHitCoordStart[0]+1 <= 9 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0]+1 && spot[1]=== lastHitCoordStart[1])) && spotsToTry.push([lastHitCoordStart[0]+1,lastHitCoordStart[1]]);
                    (lastHitCoordStart[1]-1 >= 0 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0] && spot[1]=== lastHitCoordStart[1]-1)) && spotsToTry.push([lastHitCoordStart[0],lastHitCoordStart[1]-1]);
                    (lastHitCoordStart[1]+1 <= 9 && !already_tried_spots.some(spot => spot[0]===lastHitCoordStart[0] && spot[1]=== lastHitCoordStart[1]+1)) && spotsToTry.push([lastHitCoordStart[0],lastHitCoordStart[1]+1]);
                    //console.log(`Player opponent attack: Opponent hit for the first time. Add all unhit spots surrounding [${coordToHit}] to spotsToTry. Spots to try: [${spotsToTry}]`)
                    //if I have had a hit before and my current result is a miss.
                    //If I have an established axis, then I have found the start or end. Don't add spot before start or after end.
                    //Do nothing in either case.
                }
            }else
                missedSpots.push(coordToHit);   
        }       
        //console.log(`Player ${type} attack: adding [${coordToHit}] to attacked Spots`)
        //attackedSpots.push(coordToHit);
        //console.log(`Player ${type} attack: Hit spots:`, attackedSpots);
        return result;
    }

    function addDiagonalSpotsToAttackedList(coordToHit){
        const already_tried_spots = attackedSpots.concat(missedSpots.concat(autoMissedSpots));
        if(coordToHit[0]-1 >= 0 ){
            (coordToHit[1]-1 >= 0 && !(already_tried_spots.some(entry => entry[0]===coordToHit[0]-1&& entry[1]===coordToHit[1]-1)))&& autoMissedSpots.push([coordToHit[0]-1,coordToHit[1]-1]);
            (coordToHit[1]+1 <=9  && !(already_tried_spots.some(entry => entry[0]===coordToHit[0]-1&& entry[1]===coordToHit[1]+1))) && autoMissedSpots.push([coordToHit[0]-1,coordToHit[1]+1]);
        }
        if(coordToHit[0]+1 <= 9){
            (coordToHit[1]-1 >= 0 && !(already_tried_spots.some(entry => entry[0]===coordToHit[0]+1 && entry[1]===coordToHit[1]-1))) && autoMissedSpots.push([coordToHit[0]+1,coordToHit[1]-1]);
            (coordToHit[1]+1 <=9 && !(already_tried_spots.some(entry => entry[0]===coordToHit[0]+1&& entry[1]===coordToHit[1]+1))) && autoMissedSpots.push([coordToHit[0]+1,coordToHit[1]+1]);
        }
        //console.log(`Player ${type} addDiagonalSpotstoAttackedList for ${[coordToHit]}, autoMissedSpots: `, autoMissedSpots);
    }

    function addEndSpotsToAttackedList(coord,start,end,axis){
         //put the cell left of starting coordinate of ship and to right of endCoordinate of ship to attackedSpots if it is not already marked attacked. 
         
         const already_tried_spots = attackedSpots.concat(missedSpots.concat(autoMissedSpots));
         if(axis === 'x'){
            if(coord[0]<start[0]){
                (coord[0]-1 >= 0 && !already_tried_spots.some(spot=> spot[0]=== coord[0]-1 && spot[1]=== coord[1]) ) && autoMissedSpots.push([coord[0]-1,coord[1]]);
                (end[0]+1 >= 0 && !already_tried_spots.some(spot=> spot[0]=== end[0]+1 && spot[1]=== end[1])) && autoMissedSpots.push([end[0]+1,end[1]]);
            }
            else{
                (start[0]-1 >= 0 && !already_tried_spots.some(spot=> spot[0]=== start[0]-1 && spot[1]=== start[1])) && autoMissedSpots.push([start[0]-1,start[1]]);
                (coord[0]+1 <= 9 && !already_tried_spots.some(spot=> spot[0]=== coord[0]+1 && spot[1]=== coord[1])) && autoMissedSpots.push([coord[0]+1,coord[1]]);
            }
                
         }else{
            if(coord[1]<start[1]){
                (coord[1]-1 >= 0 && !already_tried_spots.some(spot=> spot[0]=== coord[0] && spot[1]=== coord[1]-1)) && autoMissedSpots.push([coord[0],coord[1]-1]);
                (end[1]+1 <= 9 && !already_tried_spots.some(spot=> spot[0]=== end[0] && spot[1]=== end[1]+1)) && autoMissedSpots.push([end[0],end[1]+1]);
            }
            else{
                (start[1]-1 >= 0 && !already_tried_spots.some(spot=> spot[0]=== start[0] && spot[1]=== start[1]-1)) && autoMissedSpots.push([start[0],start[1]-1]);
                (coord[1]+1 <= 9 && !already_tried_spots.some(spot=> spot[0]=== coord[0] && spot[1]=== coord[1]+1)) && autoMissedSpots.push([coord[0],coord[1]+1]);
            }
         }
         //console.log(`Player ${type} addEndSpotsToAttackedList for coord ${[coord]} with start [${start}] and end [${end}], autoMissedSpots: `, autoMissedSpots);
    }

    return {
        attack
    }

}