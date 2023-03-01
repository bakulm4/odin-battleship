(()=>{"use strict";function t({name:e="",length:t=0}={}){let s=0;return{getName:()=>e,hit(){s<t&&(s+=1)},isSunk:()=>s===t,reset(){s=0}}}function s(e,t,s){s.forEach((s=>{for(let a=t,[n,o]=s;n>=0&&a>0;a--,n--)e.x=e.x.filter((e=>!(e[0]===n&&e[1]===o)));for(let a=t,[n,o]=s;o>=0&&a>0;a--,o--)e.y=e.y.filter((e=>!(e[0]===n&&e[1]===o)))}))}function a(e,t,s){const a="player"===t?".battlefield__self":".battlefield__rival",n=document.querySelector(`${a} [data-x="${e[0]}"][data-y="${e[1]}"]`).parentElement;if(n.classList.remove("battlefield-cell__empty"),s.startsWith("sunk")){n.classList.add("battlefield-cell__done","battlefield-cell__hit");const e=s.split(",")[1];document.querySelector(`${a} .battlefield-stat .ship[data-ship='${e}']`).classList.add("ship__killed")}else"hit"===s?n.classList.add("battlefield-cell__hit"):"miss"===s&&n.classList.add("battlefield-cell__miss")}document.querySelectorAll(".battlefield__self .battlefield-cell-content");const n={carrier:5,battleship:4,destroyer:3,submarine:3,patrol:2};function o(e,o){const r={};let l={carrier:[],battleship:[],destroyer:[],submarine:[],patrol:[]};Object.keys(n).forEach((e=>{r[e]={shipObj:t({name:e,length:n[e]}),coords:[]}}));let c=[],i=[];return{placeShip:function(t,s,a=r[t].coords[0],o){return function(t,s,a,n,o){let c=[],i=[];const d=l[t];if(l[t]=[],"y"===a)for(let e=0;e<s;e+=1)c.push([n[0],n[1]+e]),0===e&&n[1]-1>=0?(i.push([n[0],n[1]-1]),n[0]-1>=0&&i.push([n[0]-1,n[1]-1]),n[0]+1<=9&&i.push([n[0]+1,n[1]-1])):e===s-1&&n[1]+e+1<=9&&(i.push([n[0],n[1]+e+1]),n[0]-1>=0&&i.push([n[0]-1,n[1]+e+1]),n[0]+1<=9&&i.push([n[0]+1,n[1]+e+1])),n[0]-1>=0&&i.push([n[0]-1,n[1]+e]),n[0]+1<=9&&i.push([n[0]+1,n[1]+e]);else if("x"===a)for(let e=0;e<s;e+=1)c.push([n[0]+e,n[1]]),0===e&&n[0]-1>=0?(i.push([n[0]-1,n[1]]),n[1]-1>=0&&i.push([n[0]-1,n[1]-1]),n[1]+1<=9&&i.push([n[0]-1,n[1]+1])):e===s-1&&n[0]+e+1<=9&&(i.push([n[0]+e+1,n[1]]),n[1]-1>=0&&i.push([n[0]+e+1,n[1]-1]),n[1]+1<=9&&i.push([n[0]+e+1,n[1]+1])),n[1]-1>=0&&i.push([n[0]+e,n[1]-1]),n[1]+1<=9&&i.push([n[0]+e,n[1]+1]);return function(t){const s=Object.values(l).reduce(((e,t)=>e.concat(t)),[]);return t.every((t=>!s.some((e=>e[0]===t[0]&&e[1]===t[1]))&&t[0]>=0&&t[0]<e&&t[1]>=0&&t[1]<e))}(o?c.slice(1):c)?(r[t].coords=c,l[t]=l[t].concat(c,i),!0):(l[t]=d,!1)}(t,n[t],s,a,o)},receiveAttack:function(t){let s="miss";const n=new Set;if(i.some((e=>e[0]===t[0]&&e[1]===t[1]))||c.some((e=>e[0]===t[0]&&e[1]===t[1])))return"already_tried";for(const l of Object.values(r))if(l.coords.some((e=>e[0]===t[0]&&e[1]===t[1]))){l.shipObj.hit(),s="hit",i.push(t),t[0]-1>=0&&(t[1]-1>=0&&!c.some((e=>e[0]===t[0]-1&&e[1]===t[1]-1))&&n.add([t[0]-1,t[1]-1]),t[1]+1<e&&!c.some((e=>e[0]===t[0]-1&&e[1]===t[1]+1))&&n.add([t[0]-1,t[1]+1])),t[0]+1<e&&(t[1]-1>=0&&!c.some((e=>e[0]===t[0]+1&&e[1]===t[1]-1))&&n.add([t[0]+1,t[1]-1]),t[1]+1<e&&!c.some((e=>e[0]===t[0]+1&&e[1]===t[1]+1))&&n.add([t[0]+1,t[1]+1])),l.shipObj.isSunk()&&(s=`sunk,${l.shipObj.getName()}`,l.coords[0][0]-1>=0&&!c.some((e=>e[0]===l.coords[0][0]-1&&e[1]===l.coords[0][1]))&&n.add([l.coords[0][0]-1,l.coords[0][1]]),l.coords[0][1]-1>=0&&!c.some((e=>e[0]===l.coords[0][0]&&e[1]===l.coords[0][1]-1))&&n.add([l.coords[0][0],l.coords[0][1]-1]),l.coords[l.coords.length-1][0]+1<e&&!c.some((e=>e[0]===l.coords[l.coords.length-1][0]+1&&e[1]===l.coords[l.coords.length-1][1]))&&n.add([l.coords[l.coords.length-1][0]+1,l.coords[l.coords.length-1][1]]),l.coords[l.coords.length-1][1]+1<e&&!c.some((e=>e[0]===l.coords[l.coords.length-1][0]&&e[1]===l.coords[l.coords.length-1][1]+1))&&n.add([l.coords[l.coords.length-1][0],l.coords[l.coords.length-1][1]+1]),l.coords.forEach((e=>a(e,o,s))));break}return n.forEach((e=>{a(e,o,"miss"),c.push(e)})),"miss"===s&&c.push(t),a(t,o,s),s},areAllShipsSunk:function(){return Object.values(r).every((e=>e.shipObj.isSunk()))},getShipCoordinates:function(e){return e?r[e].coords:r},removeShipCoordinates:function(e){r[e].coords=[]},resetBoard:function(){Object.values(r).forEach((e=>{e.coords=[],e.shipObj.reset()})),Object.keys(l).forEach((e=>{l[e]=[]})),i=[],c=[]},randomPlacement:function(){Object.entries(function(e){const t={},a={};return Object.keys(n).forEach((s=>{t[s]=[],a[s]=function(e,t){const s={x:[],y:[]};for(let a=0;a<=e-t;a++)for(let t=0;t<e;t++)s.x.push([a,t]);for(let a=0;a<e;a++)for(let n=0;n<=e-t;n++)s.y.push([a,n]);return s}(e,n[s])})),Object.keys(t).forEach((e=>{const o=Math.random()>.5,r=o?"x":"y",l=a[e][r][Math.floor(Math.random()*a[e][r].length)],c=function(e,t,s){const a=[],n=[];let o=s[0],r=s[1];t?o-1>=0&&(n.push([o-1,r]),r-1>=0&&n.push([o-1,r-1]),r+1<=9&&n.push([o-1,r+1])):r-1>=0&&(n.push([o,r-1]),o-1>=0&&n.push([o-1,r-1]),o+1<=9&&n.push([o+1,r-1]));for(let s=0;s<e;s++)a.push([o,r]),t?(r-1>=0&&n.push([o,r-1]),r+1<=9&&n.push([o,r+1]),o+=1):(o-1>=0&&n.push([o-1,r]),o+1<=9&&n.push([o+1,r]),r+=1);return t?o<=9&&(n.push([o,r]),r-1>=0&&n.push([o,r-1]),r+1<=9&&n.push([o,r+1])):r<=9&&(n.push([o,r]),o-1>=0&&n.push([o-1,r]),o+1<=9&&n.push([o+1,r])),[a,n]}(n[e],o,l);t[e]=c[0],function(e,t,a){for(const o in e)t[o].length>0||s(e[o],n[o],a)}(a,t,c[0].concat(c[1]))})),t}(e)).forEach((([e,t])=>{r[e].coords=t}))},isBoardPopulated:function(){return Object.keys(n).every((e=>r[e].coords.length===n[e]))},getMissedCoords:function(){return c}}}function r(e){const t=[],s=[],a=[];let n=null,o=null,r=null,l=[];function c(e){const n=t.concat(s.concat(a));e[0]-1>=0&&(e[1]-1>=0&&!n.some((t=>t[0]===e[0]-1&&t[1]===e[1]-1))&&a.push([e[0]-1,e[1]-1]),e[1]+1<=9&&!n.some((t=>t[0]===e[0]-1&&t[1]===e[1]+1))&&a.push([e[0]-1,e[1]+1])),e[0]+1<=9&&(e[1]-1>=0&&!n.some((t=>t[0]===e[0]+1&&t[1]===e[1]-1))&&a.push([e[0]+1,e[1]-1]),e[1]+1<=9&&!n.some((t=>t[0]===e[0]+1&&t[1]===e[1]+1))&&a.push([e[0]+1,e[1]+1]))}return{attack:function(i=null,d){const u=t.concat(s.concat(a));if(i&&i.length>0&&u.some((e=>e[0]===i[0]&&e[1]===i[1])))return"already_tried";let p=i||null;if("opponent"===e)if(null!==n)p=l[Math.floor(Math.random()*l.length)],l=l.filter((e=>!(e[0]===p[0]&&e[1]===p[1])));else for(p=[Math.floor(10*Math.random()),Math.floor(10*Math.random())];u.some((e=>e[0]===p[0]&&e[1]===p[1]));)p=[Math.floor(10*Math.random()),Math.floor(10*Math.random())];const h=d.receiveAttack(p);return"opponent"===e&&(h.startsWith("sunk")?(t.push(p),null===r&&(r=n[0]===p[0]?"y":"x"),c(p),function(e,n,o,r){const l=t.concat(s.concat(a));"x"===r?e[0]<n[0]?(e[0]-1>=0&&!l.some((t=>t[0]===e[0]-1&&t[1]===e[1]))&&a.push([e[0]-1,e[1]]),o[0]+1>=0&&!l.some((e=>e[0]===o[0]+1&&e[1]===o[1]))&&a.push([o[0]+1,o[1]])):(n[0]-1>=0&&!l.some((e=>e[0]===n[0]-1&&e[1]===n[1]))&&a.push([n[0]-1,n[1]]),e[0]+1<=9&&!l.some((t=>t[0]===e[0]+1&&t[1]===e[1]))&&a.push([e[0]+1,e[1]])):e[1]<n[1]?(e[1]-1>=0&&!l.some((t=>t[0]===e[0]&&t[1]===e[1]-1))&&a.push([e[0],e[1]-1]),o[1]+1<=9&&!l.some((e=>e[0]===o[0]&&e[1]===o[1]+1))&&a.push([o[0],o[1]+1])):(n[1]-1>=0&&!l.some((e=>e[0]===n[0]&&e[1]===n[1]-1))&&a.push([n[0],n[1]-1]),e[1]+1<=9&&!l.some((t=>t[0]===e[0]&&t[1]===e[1]+1))&&a.push([e[0],e[1]+1]))}(p,n,o,r),l=[],o=n=null,r=null):"hit"===h?(t.push(p),c(p),null!==n?(null===r&&(r=n[0]===p[0]?"y":"x",l=l="x"===r?l.filter((e=>e[1]===p[1])):l.filter((e=>e[0]===p[0]))),"x"===r?p[0]<n[0]?(n[0]=p[0],n[0]-1>=0&&!u.some((e=>e[0]===n[0]-1&&e[1]===n[1]))&&l.push([n[0]-1,n[1]])):p[0]>o[0]&&(o[0]=p[0],o[0]+1<=9&&!u.some((e=>e[0]===o[0]+1&&e[1]===o[1]))&&l.push([o[0]+1,o[1]])):"y"===r&&(p[1]<n[1]?(n[1]=p[1],n[1]-1>=0&&!u.some((e=>e[0]===n[0]&&e[1]===n[1]-1))&&l.push([n[0],n[1]-1])):p[1]>o[1]&&(o[1]=p[1],o[1]+1<=9&&!u.some((e=>e[0]===o[0]&&e[1]===o[1]+1))&&l.push([o[0],o[1]+1])))):(n=[...p],o=[...p],n[0]-1>=0&&!u.some((e=>e[0]===n[0]-1&&e[1]===n[1]))&&l.push([n[0]-1,n[1]]),n[0]+1<=9&&!u.some((e=>e[0]===n[0]+1&&e[1]===n[1]))&&l.push([n[0]+1,n[1]]),n[1]-1>=0&&!u.some((e=>e[0]===n[0]&&e[1]===n[1]-1))&&l.push([n[0],n[1]-1]),n[1]+1<=9&&!u.some((e=>e[0]===n[0]&&e[1]===n[1]+1))&&l.push([n[0],n[1]+1]))):s.push(p)),h}}}const l=document.querySelector(".notification"),c=document.querySelector(".notification-submit"),i=document.querySelector(".notification-message"),d=document.querySelectorAll('[draggable="true"]'),u=document.querySelectorAll(".battlefield__self .battlefield-cell-content"),p=document.querySelector(".battlefield__rival"),h=p.querySelectorAll(".battlefield-cell-content"),f=document.querySelector(".battlefield__self"),m=document.querySelector(".placeships-variant.random"),y=document.querySelector(".placeships-variant.reset"),g=document.querySelector(".battlefield-start-button"),_=document.querySelector(".port"),b=_.querySelectorAll(".port-ship"),L=document.querySelectorAll(".battlefield-stat"),v=document.querySelector("footer");let S;function E(e){if(e.currentTarget.style.opacity="0.4",e.dataTransfer.setData("text/plain",`${e.currentTarget.id},${e.currentTarget.dataset.axis},${e.currentTarget.dataset.ship}`),e.dataTransfer.effectAllowed="move",e.currentTarget.parentElement.classList.contains("battlefield-cell-content")){const t=S.getShipCoordinates("player",e.currentTarget.dataset.ship);S.removeShipCoordinates("player",e.currentTarget.dataset.ship),t.forEach((e=>{C(document.querySelector(`[data-x="${e[0]}"][data-y="${e[1]}"]`),"",!1)}))}}function T(e){e.stopPropagation(),e.preventDefault();const[t,s,a]=e.dataTransfer.getData("text/plain").split(","),n=document.getElementById(t),[o,r]=[parseInt(e.currentTarget.dataset.x),parseInt(e.currentTarget.dataset.y)];if(e.currentTarget.style.opacity="1",e.currentTarget.classList.remove("dragging"),S.placeShipOnBoard("player",a,s,[o,r],!1)){const t=S.getShipCoordinates("player",a);n.style.opacity="1",e.currentTarget.appendChild(n),t.forEach((e=>{C(document.querySelector(`[data-x="${e[0]}"][data-y="${e[1]}"]`),a,!0)})),S.canStartGame()&&w(),y.classList.contains("inactive")&&y.classList.remove("inactive")}}function x(e){e.preventDefault(),e.dataTransfer.dropEffect="all",e.currentTarget.dataset.ship&&e.currentTarget.dataset.ship.length>0||(e.currentTarget.style.opacity="0.4",e.currentTarget.classList.add("dragging"))}function k(e){"true"===e.currentTarget.getAttribute("draggable")&&(e.currentTarget.style.opacity="1")}function q(e){return e.preventDefault(),e.dataTransfer.dropEffect="all",!1}function O(e){e.currentTarget.style.opacity="1",e.currentTarget.classList.remove("dragging")}function $(t){if("place-ships"===S.getState()){if(t.currentTarget.parentElement.classList.contains("battlefield-cell-content")){const e="x"===t.currentTarget.dataset.axis?"y":"x",s=t.currentTarget.dataset.ship,[a,n]=[parseInt(t.currentTarget.parentElement.dataset.x),parseInt(t.currentTarget.parentElement.dataset.y)],o=!0,r=S.getShipCoordinates("player",s);if(S.placeShipOnBoard("player",s,e,[a,n],o)){t.currentTarget.dataset.axis=e;const a=S.getShipCoordinates("player",s);for(let e=1;e<a.length;e++)C(document.querySelector(`[data-x="${a[e][0]}"][data-y="${a[e][1]}"]`),s,!0),C(document.querySelector(`[data-x="${r[e][0]}"][data-y="${r[e][1]}"]`),"",!1)}else t.currentTarget.classList.add("error"),setTimeout((e=>{e.classList.remove("error")}),1e3,t.currentTarget)}}else e.currentTarget.classList.add("error"),setTimeout((e=>{e.classList.remove("error")}),1e3,e.currentTarget)}function C(e,t,s){s?(e.dataset.ship=t,e.parentElement.classList.remove("battlefield-cell__empty"),e.parentElement.classList.add("battlefield-cell__busy")):(e.dataset.ship="",e.parentElement.classList.remove("battlefield-cell__busy"),e.parentElement.classList.add("battlefield-cell__empty"))}function w(){_.classList.add("none"),p.classList.remove("none"),g.classList.remove("none"),j("Press the Play button to start the game.")}function j(e){i.innerText=e}function A(){document.querySelectorAll(".battlefield-cell__busy").forEach((e=>{e.querySelector(".battlefield-cell-content").dataset.ship="",e.classList.remove("battlefield-cell__busy"),e.classList.add("battlefield-cell__empty")}))}function B(){S.resetBoard("player");const e=Array.from(b);document.querySelectorAll(".battlefield-cell-content .ship-box").forEach((t=>{t.parentElement.removeChild(t),t.dataset.axis="x",e.find((e=>e.classList.contains(t.dataset.ship))).appendChild(t)})),A(),_.classList.contains("none")&&_.classList.remove("none"),!p.classList.contains("none")&&p.classList.add("none"),!g.classList.contains("none")&&g.classList.add("none"),!y.classList.contains("inactive")&&y.classList.add("inactive"),j("Place the ships.")}function M(e){if("running"===S.getState()&&"player"===S.getTurn()){const t=[parseInt(e.currentTarget.dataset.x),parseInt(e.currentTarget.dataset.y)];S.playTurn(t)}}function P(e){"player"===e?(p.classList.contains("battlefield__wait")&&p.classList.remove("battlefield__wait"),!f.classList.contains("battlefield__wait")&&f.classList.add("battlefield__wait")):(!p.classList.contains("battlefield__wait")&&p.classList.add("battlefield__wait"),f.classList.contains("battlefield__wait")&&f.classList.remove("battlefield__wait"))}h.forEach((e=>{e.addEventListener("click",M)})),d.forEach((e=>{e.addEventListener("dragstart",E),e.addEventListener("dragend",k),e.addEventListener("click",$)})),u.forEach((e=>{e.addEventListener("dragenter",x),e.addEventListener("dragover",q),e.addEventListener("dragleave",O),e.addEventListener("drop",T)})),y.addEventListener("click",B),m.addEventListener("click",(function(){S.placeShipsRandomly("player"),A(),Object.keys(n).forEach((e=>{const t=S.getShipCoordinates("player",e),s=t[0][0]===t[t.length-1][0]?"y":"x",a=document.getElementById(e);a.dataset.axis=s;const[n,o]=t[0],r=document.querySelector(`[data-x="${n}"][data-y="${o}"]`);a.parentElement.removeChild(a),r.appendChild(a),t.forEach((t=>{const s=document.querySelector(`[data-x="${t[0]}"][data-y="${t[1]}"]`);s.dataset.ship=e,s.parentElement.classList.remove("battlefield-cell__empty"),s.parentElement.classList.add("battlefield-cell__busy")}))})),y.classList.contains("inactive")&&y.classList.remove("inactive"),w()})),g.addEventListener("click",(function(){S.startGame(),L.forEach((e=>e.classList.remove("none"))),!_.classList.contains("none")&&_.classList.add("none"),p.classList.contains("none")&&p.classList.remove("none"),v.classList.add("none"),P(S.getTurn())})),c.addEventListener("click",(function(){S.resetGame(),B(),document.querySelectorAll(".battlefield-cell__miss, .battlefield-cell__hit, .battlefield-cell__done").forEach((e=>{e.classList.contains("battlefield-cell__miss")&&e.classList.remove("battlefield-cell__miss"),e.classList.contains("battlefield-cell__hit")&&e.classList.remove("battlefield-cell__hit"),e.classList.contains("battlefield-cell__done")&&e.classList.remove("battlefield-cell__done")})),document.querySelectorAll(".ship__killed").forEach((e=>{e.classList.remove("ship__killed")})),c.classList.add("none"),l.classList.contains("notification__game-over-win")&&l.classList.remove("notification__game-over-win"),l.classList.contains("notification__game-over-lose")&&l.classList.remove("notification__game-over-lose"),L.forEach((e=>e.classList.add("none"))),!p.classList.contains("battlefield__wait")&&p.classList.add("battlefield__wait"),f.classList.contains("battlefield__wait")&&f.classList.remove("battlefield__wait"),v.classList.remove("none")}));const G=function(){let e="",t="",s="",a=null,n=null,i=null,d=null;function u(){a=o(10,"player"),n=o(10,"opponent"),i=r("player"),d=r("opponent"),e="place-ships",s="Place the ships.",n.randomPlacement(),j(s)}return u(),{initialize:u,resetGame:function(){e="place-ships",s="Place the ships.",a.resetBoard(),n.resetBoard(),n.randomPlacement(),j(s)},canStartGame:function(){return n.isBoardPopulated()&&a.isBoardPopulated()},placeShipOnBoard:function(e,t,s,o,r){return("player"===e?a:n).placeShip(t,s,o,r)},placeShipsRandomly:function(e){("player"===e?a:n).randomPlacement()},removeShipCoordinates:function(e,t){("player"===e?a:n).removeShipCoordinates(t)},getShipCoordinates:function(s,o){return"place-ships"===e?a.getShipCoordinates(o):t===s?("player"===t?a:n).getShipCoordinates(o):void 0},startGame:function(){e="running",t="player",s="Game started. Your turn.",j(s)},resetBoard:function(e){("player"===e?a:n).resetBoard()},getState:function(){return e},getTurn:function(){return t},playTurn:function o(r){const u="player"===t?n:a,p="player"===t?r:null,h=("player"===t?i:d).attack(p,u);if("miss"===h)s="player"===t?"You missed.":"Opponent missed";else if("hit"===h)s="player"===t?"You hit.":"Opponent hit.";else if(h.startsWith("sunk")){const e=h.split(",")[1];s="player"===t?`You sunk opponent's ${e}`:`Opponent sunk your ${e}.`}j(s),u.areAllShipsSunk()?(s="player"===t?"Game Over. Congratulations you won!":"Game over. You lose.",e="finished",function(e){c.classList.remove("none"),"player"===e?(l.classList.add("notification__game-over-win"),c.value="Play again "):(l.classList.add("notification__game-over-lose"),c.value="Rematch")}(t),j(s)):"miss"===h?setTimeout((()=>(t="player"===t?"opponent":"player",P(t),"opponent"===t?(s="Opponent's turn.",setTimeout((()=>{o(null)}),3e3)):s="Your turn",void j(s))),1e3):("hit"===h||h.startsWith("sunk"))&&(setTimeout((()=>{j(("player"===t?"Your":"Opponent's")+" turn.")}),2e3),"opponent"===t&&setTimeout((()=>{o(null)}),4e3))}}}();!function(e){S=e}(G)})();
//# sourceMappingURL=main.js.map