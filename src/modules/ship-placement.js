import { ship_types } from "./gameboard-factory";

export default function place_ships(board_size){
    const placements = {};
    const possible_placements= {};
    Object.keys(ship_types).forEach(key=>{
        placements[key]=[];
        possible_placements[key] = calculate_possible_placement(board_size,ship_types[key])
    });


    Object.keys(placements).forEach(ship=>{
        const is_horizontal = Math.random() > 0.5 ? true:false;
        const direction= is_horizontal ? 'x':'y';
        const start = possible_placements[ship][direction][Math.floor(Math.random()*possible_placements[ship][direction].length)];

        const result = calculate_placement(ship_types[ship],is_horizontal,start);
 
        placements[ship] = result[0];
        update_possible_placements(possible_placements,placements,result[0].concat(result[1]));
        
    });
   
    return placements;
}

function calculate_possible_placement(board_size,ship_length){
    const result = {'x':[],'y':[]};
    for(let i=0;i<=board_size-ship_length;i++){
        for(let j=0;j<board_size;j++)
            result.x.push([i,j])
    }
    for(let i=0;i<board_size;i++){
        for(let j=0;j<=board_size-ship_length;j++)
            result.y.push([i,j])
    }
    return result;
}

function calculate_placement(ship_length,is_horizontal,start_coord){
    const occupied_coords = [];
    const surrounding_coords = [];
    let currX = start_coord[0];
    let currY = start_coord[1];

    if(is_horizontal){
        if(currX-1 >=0){
            surrounding_coords.push([currX-1,currY]);
            (currY-1>=0)&& surrounding_coords.push([currX-1,currY-1]);
            (currY+1<=9)&& surrounding_coords.push([currX-1,currY+1]);
        }
    }else{
        if(currY-1 >=0){
            surrounding_coords.push([currX,currY-1]);
            (currX-1>=0)&& surrounding_coords.push([currX-1,currY-1]);
            (currX+1<=9)&& surrounding_coords.push([currX+1,currY-1]);
        }
    }

    for(let i=0;i<ship_length;i++){
        occupied_coords.push([currX,currY]);
        if(is_horizontal){
            (currY-1>=0)&& surrounding_coords.push([currX,currY-1]);
            (currY+1<=9)&& surrounding_coords.push([currX,currY+1]);
            currX+=1;
        }
        else{
            (currX-1>=0)&& surrounding_coords.push([currX-1,currY]);
            (currX+1<=9)&& surrounding_coords.push([currX+1,currY]);
            currY+=1;
        }
    }
    if(is_horizontal){
        if(currX<=9){
            surrounding_coords.push([currX,currY]);
            (currY-1>=0)&& surrounding_coords.push([currX,currY-1]);
            (currY+1<=9)&& surrounding_coords.push([currX,currY+1]);
        }
    }else{
        if(currY <=9){
            surrounding_coords.push([currX,currY]);
            (currX-1>=0)&& surrounding_coords.push([currX-1,currY]);
            (currX+1<=9)&& surrounding_coords.push([currX+1,currY]);
        }
    }

    return [occupied_coords,surrounding_coords];
}

function update_possible_placements(possible_placements,placements,occupied_spots){
    
    for(const ship in possible_placements){
        if(placements[ship].length>0)
            continue;
        remove_possible_spots_for_ship(possible_placements[ship],ship_types[ship],occupied_spots);
    }
}

function remove_possible_spots_for_ship(possible_placement_obj,ship_length,occupied_spots){
    occupied_spots.forEach(spot=>{
        //remove spots up to length places to left of current spot
        for(let count = ship_length, [x,y]= spot; x >= 0 && count > 0; count--, x--){
            possible_placement_obj.x = possible_placement_obj.x.filter(item=>!(item[0]===x && item[1]===y));
        }
      
        //remove spots up to length places above currentspot
        for(let count = ship_length, [x,y]= spot; y >= 0 && count > 0; count--, y--){
            possible_placement_obj.y = possible_placement_obj.y.filter(item=>!(item[0]===x && item[1]===y));
        }
    });
}

