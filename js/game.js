let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas);

  

console.log('My Character is', world.character);

}

window.addEventListener("keypress", (e) => {
  console.log(e);
});

// ctx = canvas.getContext("2d"); // ctx ist variable Name
// das steht normalaweise in der Function init

//  console.log('My Character is', world['character']);

  //PROBE
  // character.src = '../img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png';
  // ctx.drawImage(character, 20, 20, 50, 150); // Coordinate 20, 20 + breite 50, hoch 150px

  // KONTROLE BILD, Copy relative Path
  // setTimeout (function(){
  //     ctx.drawImage(character, 20, 20, 50, 150); // Coordinate 20, 20 + breite 50, hoch 150px
  // }, 2000);
