class Chicken extends MovableObject{
    height = 70;
    y = 360;
    width = 80;


    constructor(){
        super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random()*500; //( Math.random()*500;--> von der Konsole, startet in der unterschidliche stelle, jedes mahl)
    }
    


}