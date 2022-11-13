let poseNet;
let pose;

let leftShoulderX;
let leftShoulderY;
let rightShoulderX;
let rightShoulderY;

let dis;//左右肩膀之间的距离

let bulletY;//1-5中子弹的y坐标

// let bulletListX = [];//0中子弹的x坐标
// let bulletListY = [];//0中子弹的y坐标
let bullet1Y;
let bullet1X;

let clientState = 0;//
let client0State = 0;

let clientNumber;//客户端索引
let bulletNumber = 0;//判定成功的子弹数目
let bulletNumber1 = 0;//玩家1判定成功的子弹数目
let bulletNumber2 = 0;//玩家2判定成功的子弹数目
let bulletNumber3 = 0;//玩家3判定成功的子弹数目

let virusHP = 100;

let button;
let gameState = 0;

var socket;
// let textures = [];

function preload() {
    // spritesheet = loadImage('flakes32.png');
}

function setup() {
    ellipseMode(RADIUS);
    imageMode(CORNER);
    createCanvas(windowWidth, windowHeight);
    socket = io.connect('http://localhost:3000');
    //准备camera
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    rectMode(CORNERS);// rect() 的前两个参数解读成形状其中一个角落的位置，而第三和第四个参数则被解读成对面角落的位置
    bulletY = height/2;
    bullet1X = width/2;
    bullet1Y = height/1.2;

    socket.on('clientState', function (clientState){
        clientNumber = clientState;//1为第一个客户端，0为其他客户端
    })
}

function gotPoses(poses){
    if(poses.length > 0){
        pose = poses[0].pose;
    }
}

function modelLoaded(){
    console.log('poseNet ready');
}


function draw() {


    // translate(video.width, 0);//视频左右翻转
    // scale(-1, 1);
    background(0, 0, 0);
    image(video, 0, 0, width, width * video.height / video.width);
    // translate(video.width, 0);//视频左右翻转
    // scale(-1, 1);
    if(pose){
        leftShoulderX = pose.leftShoulder.x;
        leftShoulderY = pose.leftShoulder.y;
        rightShoulderX = pose.rightShoulder.x;
        rightShoulderY = pose.rightShoulder.y;
    }

    if(clientNumber == 0){
        // console.log('我是第一个客户端！')
        socket.on('addBullet10', function(b){//接收玩家1的子弹数
            // console.log(b);
            bulletNumber1 = b;
            socket.emit('reduceBullet1', bulletNumber1)//把子弹数发给玩家1
        })
        socket.on('addBullet20', function(b){
            // console.log(b);
            bulletNumber2 = b;
        })
        socket.on('addBullet30', function(b){
            // console.log(b);
            bulletNumber3 = b;
        })

        fill('purple');
        text('VIRUS\'s HP: ' + virusHP, width/2.5, height/5);

        ellipse(leftShoulderX, leftShoulderY, 50);
        textSize(64);
        fill('red');
        text(bulletNumber1, width/2, height/1.2);
        fill('blue');
        text(bulletNumber2, width/4, height/1.2);
        fill('yellow')
        text(bulletNumber3, width/1.25, height/1.2);
        let dis1 = dist(width/2, height/1.2, leftShoulderX, leftShoulderY);
        let dis2 = dist(width/4, height/1.2, rightShoulderX, rightShoulderY);
        let dis3 = dist(width/1.25, height/1.2, rightShoulderX, rightShoulderY);
        if(bulletNumber1 > 0 & dis1 < 100 & client0State == 0){
            virusHP-=5
            client0State = 1;
            bulletNumber1--;

        }else if(dis1 > 200){
            client0State = 0;
        }
        if(bulletNumber2 > 0 & dis2 < 100 & client0State == 0){
            virusHP-=5
            client0State = 1;
            bulletNumber2--;
        }else if(dis2 > 200){
            client0State = 0;
        }
        if(bulletNumber3 > 0 & dis3 < 100 & client0State == 0){
            virusHP-=5
            client0State = 1;
            bulletNumber3--;
        }else if(dis3 > 200){
            client0State = 0;
        }
        // if((dis1 < 100 & client0State == 0) || (dis2 < 100 & client0State == 0) || (dis3 < 100 & client0State == 0)){
        //     virusHP-=5
        //     client0State = 1;
        // }else if(dis1 > 100 & dis2 > 100 & dis3 > 100){
        //     client0State = 0;
        // }
        // if(client0State == 1 & bullet1Y > -50){
        //     bullet1Y-=5;
        // }else if(bulletY < -50){
        //     client0State = 0;
        // }
        //肩膀触碰子弹以开始游戏

    }else{
        //console.log('略略略')
        socket.on('reduceBullet01', function (b){
            bulletNumber = b;
        })
        if(pose){
            textSize(64);
            if(clientNumber == 1){
                fill('red');
                text('玩家1', 50, 100);
            }else if(clientNumber == 2){
                fill('blue');
                text('玩家2', 50, 100);
            }else if(clientNumber == 3){
                fill('yellow');
                text('玩家3', 50, 100);
            }

            fill('red');
            ellipse(leftShoulderX, leftShoulderY, 50);
            fill('white');
            ellipse(rightShoulderX, rightShoulderY, 50);

            dis = dist(leftShoulderX, leftShoulderY, rightShoulderX, rightShoulderY);

            if(dis < 300 & clientState == 0){
                if(clientNumber == 1){
                    fill('red');
                }else if(clientNumber == 2){
                    fill('blue');
                }else if(clientNumber == 3){
                    fill('yellow');
                }

                bulletY-=5;
                ellipse(width/2, bulletY, 50);
                if(bulletY < 0){
                    bulletY = height/2;
                    clientState = 1;
                    bulletNumber++;
                    if(clientNumber == 1){
                        socket.emit('addBullet1',bulletNumber);
                    }
                    if(clientNumber == 2){
                        socket.emit('addBullet2',bulletNumber);
                    }
                    if(clientNumber == 3){
                        socket.emit('addBullet3',bulletNumber);
                    }

                }
            }

            if(dis > 400 & clientState == 1){
                clientState = 0;
            }

        }
    }

}

//每个玩家对应的炮塔的类
class Tower{
    constructor(i, x, y, number, color) {
        this.i = i;//炮塔归属于第几个玩家
        this.x = x;//炮塔的x位置坐标
        this.y = y;//炮塔的y位置坐标
        this.number = number;//炮塔剩余的子弹数目
        this.color = color;//弹药的颜色
    }
    // image
    //炮塔的位置
    position(){
        fill(this.color);
        text(this.number, this.x, this.y);
    }
}

class Bullet{
    constructor(i, x, y ) {
        this.i = i;//子弹归属于第几个玩家
        this.x = x;//子弹的x坐标
        this.y = y;//子弹的y坐标
    }

}


