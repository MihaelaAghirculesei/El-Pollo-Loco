class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor(){
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png');

        this.x = 100 + Math.random()*500; //( Math.random()*500;--> von der Konsole, startet in der unterschidliche stelle, jedes mahl)
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

}