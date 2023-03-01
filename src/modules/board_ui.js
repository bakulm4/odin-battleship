const board_cells = document.querySelectorAll('.battlefield__self .battlefield-cell-content');

export function update_cell(coord,type,status){
    const parent_element_class = type === 'player'? '.battlefield__self':'.battlefield__rival';
    const cell = document.querySelector(`${parent_element_class} [data-x="${coord[0]}"][data-y="${coord[1]}"]`).parentElement;
    cell.classList.remove('battlefield-cell__empty');
    if(status.startsWith('sunk')){
        cell.classList.add('battlefield-cell__done','battlefield-cell__hit');
        const stat_ship = status.split(',')[1];
        //console.log(`board_ui.update_cell. statship query selector: "${parent_element_class} .battlefield-stat .ship[data-ship='${stat_ship}']"`);
        const stat_ship_elem = document.querySelector(`${parent_element_class} .battlefield-stat .ship[data-ship='${stat_ship}']`);
        stat_ship_elem.classList.add('ship__killed');
    }
        
    else if(status==='hit'){
        cell.classList.add('battlefield-cell__hit');
    }else if(status === 'miss')
        cell.classList.add('battlefield-cell__miss');
}