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
      ],
     [
        new Coin(600, 200), 
        new Coin(800, 260), 
        new Coin(880, 210), 
        new Coin(960, 150), 
        new Coin(1040, 210), 
        new Coin(1700, 210), 
        new Coin(2100, 210), 
        new Coin(2400, 290), 
        new Coin(2500, 150), 
        new Coin(1900, 250), 
        new Coin(2000, 300)
      ]

    );