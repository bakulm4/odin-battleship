export default function Ship({name='',length=0}={}){
    let numHits = 0;
    
    return {
        getName() {
            return name;
        },
        hit(){
            if(numHits<length){
                numHits += 1;
                //console.log(`${name} : length: ${length} , Numhits: `, numHits);
            }        
        },
        isSunk(){
            return numHits === length;
        },
        reset(){
            numHits = 0;
        }
    };
}
//const ship = Ship({name:'Carrier',length:5});
