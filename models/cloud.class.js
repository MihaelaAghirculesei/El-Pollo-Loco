class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor(x) {
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png', 'img_pollo_locco/img/5_background/layers/4_clouds/2.png' );
        this.x = x;  // Die X-Position wird übergeben
        this.canvas = document.getElementById('canvas');
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x < -this.width) {
                this.x = canvas.width + Math.random() * 500;  // Spawne sie zufällig rechts neu
                this.y = 20 + Math.random() * 50;  // Höhenvariation für realistischere Bewegung
            }
        }, 1000 / 60);
    }

    // constructor(){
    //     let cloudImages = [
    //         'img_pollo_locco/img/5_background/layers/4_clouds/1.png',
    //         'img_pollo_locco/img/5_background/layers/4_clouds/2.png'
    //     ];
        
    //     let randomImage = cloudImages[Math.floor(Math.random() * cloudImages.length)];
    
    //     super().loadImage(randomImage);
    
    //     this.x = 100 + Math.random() * 500;
    //     this.canvas = document.getElementById('canvas'); 
    //     this.animate();
    // }

    // animate() {
    //     setInterval(() => {
    //         this.moveLeft();
    //         if (this.x < -this.width) {  
    //             this.x = this.canvas.width + Math.random() * 200;
    //         }
    //     }, 1000 / 60);
    // } 
}