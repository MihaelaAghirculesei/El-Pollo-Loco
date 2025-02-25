class ThrowableObject  extends MovableObject {
    IMAGES_ROTATION = [
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    
    IMAGES_SPLASH = [
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    
    markedForRemoval = false;

    removeFromWorld() {
        this.markedForRemoval = true;
    }

    constructor (x, y) {
        // super().loadImage('img_pollo_locco/img/7_statusbars/3_icons/icon_salsa_bottle.png');
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.throw();
        this.animate();
    }

    throw(){

        this.speedY = 30;
        this.applyGravity();
        this.rotationInterval = setInterval(() => {
            this.x += 10;
        }, 25);

    }

    animate() {
        setInterval(() => {
            if (!this.splashed) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    splash() {
        this.splashed = true;
        clearInterval(this.rotationInterval);
        this.playAnimationOnce(this.IMAGES_SPLASH).then(() => {
            this.removeFromWorld();
        });
    }

    removeFromWorld() {
        if (this.world) {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }
    }

    playAnimationOnce(images) {
        return new Promise((resolve) => {
            let i = 0;
            const animationInterval = setInterval(() => {
                if (i < images.length) {
                    this.img = this.imageCache[images[i]];
                    i++;
                } else {
                    clearInterval(animationInterval);
                    resolve();
                }
            }, 100);
        });
    }
}

