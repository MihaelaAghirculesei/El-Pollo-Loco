const level1 = new Level(
    [
        new Chicken(850), 
        new Chicken(1000), 
        new Chicken(1500),
       new Endboss()
      ],
      [
        new Cloud()
      ],
      [
        new Coin(300, 300),
        new Coin(350, 300), 
        new Coin(400, 300), 
        new Coin(450, 300), 
        new Coin(500, 200), 
        new Coin(550, 200), 
        new Coin(600, 200), 
        new Coin(650, 200), 
       
        new Coin(750, 100),
        new Coin(800, 100),
        new Coin(850, 100),
        new Coin(900, 100),

        new Coin(1350, 300),
        new Coin(1400, 300), 
        new Coin(1450, 300), 
        new Coin(1500, 300), 
        new Coin(1550, 200), 
        new Coin(1600, 200), 
        new Coin(1650, 200), 
        new Coin(1700, 200),

        new Coin(1850, 300), 
        new Coin(1900, 300), 
        new Coin(1950, 300), 
        new Coin(2000, 300),

        new Coin(2350, 300),
        new Coin(2400, 300), 
        new Coin(2450, 300), 
        new Coin(2500, 300), 
        new Coin(2550, 200), 
        new Coin(2600, 200), 
        new Coin(2650, 200), 
        new Coin(2700, 200),

        new Coin(3850, 300), 
        new Coin(3900, 300), 
        new Coin(3950, 300), 
        new Coin(3000, 300)
      ],
      [
        new Bottle(180, 370), 
        new Bottle(200, 370),
        new Bottle(215, 370),
        new Bottle(230, 370),
        new Bottle(245, 370),
        new Bottle(260, 370),

        new Bottle(855, 370),
        new Bottle(875, 370),
        new Bottle(895, 370),
        new Bottle(915, 370),
        new Bottle(935, 370),
        new Bottle(955, 370),

        new Bottle(1550, 370),
        new Bottle(1900, 370),  
        new Bottle(2700, 370), 
        new Bottle(2400, 370), 
        new Bottle(1800, 370), 
        

        new Bottle(1645, 370),
        new Bottle(1665, 370),
        new Bottle(1685, 370),
        new Bottle(1705, 370),
        new Bottle(1725, 370),

        new Bottle(3550, 370),
        new Bottle(3900, 370),  
        new Bottle(4700, 370), 
        new Bottle(4400, 370), 
        new Bottle(4800, 370), 
        

        new Bottle(3645, 370),
        new Bottle(3665, 370),
        new Bottle(3685, 370),
        new Bottle(3705, 370),
        new Bottle(3725, 370),
      ],
      [
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", -719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),
    
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 0),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719),
    
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719 * 2),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 2),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719 * 3),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 3),

        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719 * 4),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 4),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 4),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 4),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719 * 5),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 5),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 5),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 5),

        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/air.png", 719 * 6),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 6),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 6),
        new BackgroundObjekt("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 6),
        
      ],
    );