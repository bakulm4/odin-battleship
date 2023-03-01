import Ship from '../src/modules/ship-factory';

test('Get name',()=>{
    const carrierShip = Ship({name:'Carrier'});
    const battleShip = Ship({name:'BattleShip'});
    expect(carrierShip.getName()).toBe('Carrier');
    expect(battleShip.getName()).toBe('BattleShip');
});

test('Hit and isSunk', ()=>{
    const ship = Ship({name:'Carrier',length:5});
    for(let i=0;i<4;i+=1)
        ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});