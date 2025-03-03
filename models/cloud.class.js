class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor(){
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png');

        this.x = 100 + Math.random()*500;
        this.canvas = document.getElementById('canvas'); 
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x < -this.width) {  // Wolke zurücksetzen, bevor sie ganz weg ist
                this.x = canvas.width + Math.random() * 200;
                this.y = 20 + Math.random() * 50;  // Höhenvariation für realistischere Bewegung
            }
        }, 1000 / 60);
    } 
}