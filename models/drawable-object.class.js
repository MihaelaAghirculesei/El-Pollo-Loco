class DrawableObject {
    x = 120;
    y = 250;  
    height = 200;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


loadImage(path){
    this.img = new Image();
    this.img.src = path;
}

draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width,this.height);
}

loadImages(arr) {
    arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        img.style = 'transform: scalX (-1)'
        this.imageCache [path] = img;
    });
}


}