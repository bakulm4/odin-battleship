import GameBoard from "../src/modules/gameboard-factory";

test('Place Ship',()=>{
    const board = GameBoard();
    expect(board.placeShip('battleship','x',[7,4])).toBe(false);
    expect(board.placeShip('carrier','y',[4,6])).toBe(false);
    expect(board.placeShip('destroyer','x',[-2,7])).toBe(false);
    expect(board.placeShip('submarine','x',[10,4])).toBe(false);
    expect(board.placeShip('patrol','y',[-2,-1])).toBe(false);
    expect(board.placeShip('submarine','y',[5,10])).toBe(false);
    expect(board.placeShip('carrier','y',[8,0])).toBe(true);
    expect(board.placeShip('battleship','x',[3,6])).toBe(true);
    expect(board.placeShip('destroyer','y',[1,4])).toBe(true);
    expect(board.placeShip('submarine','y',[4,4])).toBe(false);
    expect(board.placeShip('submarine','y',[7,4])).toBe(true);
    expect(board.placeShip('patrol','x',[5,4])).toBe(true);
    expect(board.placeShip('destroyer','x',[0,0])).toBe(false);

});

//[8,0],[8,1],[8,2],[8,3],[8,4],
//[3,6],[4,6],[5,6],[6,6],
//[1,4],[1,5],[1,6],
//[7,4],[7,5],[7,6]
//[5,4],[6,4]

test('Receive Attack',()=>{
    const board = GameBoard();
    board.placeShip('carrier','y',[8,0]);
    board.placeShip('battleship','x',[3,6]);
    board.placeShip('destroyer','y',[1,4]) ;
    board.placeShip('submarine','y',[7,4]);
    board.placeShip('patrol','x',[5,4]);

    expect(board.receiveAttack([1,9])).toBe('miss');
    expect(board.receiveAttack([7,4])).toBe('hit');
    board.receiveAttack([7,5]);
    expect(board.receiveAttack([7,6])).toBe('sunk');
});

test('Are All Ships Sunk',()=>{
    const board = GameBoard();
    board.placeShip('carrier','y',[8,0]);
    board.placeShip('battleship','x',[3,6]);
    board.placeShip('destroyer','y',[1,4]) ;
    board.placeShip('submarine','y',[7,4]);
    board.placeShip('patrol','x',[5,4]);
    
    board.receiveAttack([8,0]);
    board.receiveAttack([8,1]);
    board.receiveAttack([8,2]);
    board.receiveAttack([8,3]);
    board.receiveAttack([8,4]);
    board.receiveAttack([3,6]);
    board.receiveAttack([4,6]);
    board.receiveAttack([5,6]);
    board.receiveAttack([6,6]);
    board.receiveAttack([1,4]);
    board.receiveAttack([1,5]);
    board.receiveAttack([1,6]);
    expect(board.areAllShipsSunk()).toBe(false);
    board.receiveAttack([7,4]);
    board.receiveAttack([7,5]);
    board.receiveAttack([7,6]);
    board.receiveAttack([5,4]);
    board.receiveAttack([6,4]);
    expect(board.areAllShipsSunk()).toBe(true);

});
