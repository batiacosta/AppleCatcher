import './style.css'
import Phaser, { Physics } from 'phaser'

const sizes = {
  width: 500,
  height: 500,
}
const speedDown = 300;
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed = speedDown + 50
    this.target // The actual apple
    this.points = 0
  }
  
  preload(){
    this.load.image("bg", "assets/bg.png")
    this.load.image("basket", "assets/basket.png")
    this.load.image("apple", "assets/apple.png")
  }
  create(){
    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add
      .image(0, sizes.width-100, "basket")
      .setOrigin(0, 0)
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)
    this.player.setSize(80,15)
    .setOffset(this.player.width/10, this.player.height - this.player.height/10)

    this.cursor = this.input.keyboard.createCursorKeys()

    this.target = this.physics.add
      .image(0, 0, "apple")
      .setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown)
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)
  }
  
  update(){

    if(this.target.y >= sizes.height){
      this.target.setY(0)
      this.target.setX(this.getRandomX())
    }
    this.playerInput()

  }

  playerInput() {
    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    }
    else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480)
  }
  targetHit(){
    this.target.setY(0);
    this.target.setX(this.getRandomX())
    this.points++
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene:[GameScene]
}
const game = new Phaser.Game(config)
