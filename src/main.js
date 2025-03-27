import './style.css'
import Phaser, { Physics } from 'phaser'

const sizes = {
  width: 500,
  height: 500,
}
const speedDown = 300;

const gameStartDiv= document.getElementById("gameStartDiv")
const gameStartButton = document.getElementById("gameStartButton")
const gameEndDiv = document.getElementById("gameEndDiv")
const gameWinLoseSpan = document.getElementById("gameWinLoseSpan")
const gameEndScoreSpan = document.getElementById("gameEndScoreSpan")
const gameEndButton = document.getElementById("gameEndButton")

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed = speedDown + 50
    this.target // The actual apple
    this.points = 0
    this.textScore
    this.textTimer
    this.timedEvent
    this.timeLeft
    this.coinSound
    this.bgMusic
    this.emmiterParticles
  }
  
  preload(){
    this.load.image("bg", "assets/bg.png")
    this.load.image("basket", "assets/basket.png")
    this.load.image("apple", "assets/apple.png")
    this.load.audio("coin", "assets/coin.mp3")
    this.load.audio("bgMusic", "assets/bgMusic.mp3")
    this.load.image("money.png", "assets/money.png")
  }
  create(){
    this.scene.pause("scene-game") // Game starts paused
    this.coinSound = this.sound.add("coin")
    this.bgMusic = this.sound.add("bgMusic")
    this.bgMusic.play()
    this.bgMusic.loop = true

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
    this.target.setMaxVelocity(0, speedDown * 1.5)
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "black",
    })
    this.textTimer = this.add.text(10, 10, "Timer: 00", {
      font: "25px Arial",
      fill: "black",
    })

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this)

    this.emmiterParticles = this.add.particles(0,0, "money.png", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.05,
      duration: 100,
      emmiting: false
    })
    this.emmiterParticles.startFollow(this.player, this.player.width/2, this.player.height /2, true)
  }
  
  update(){

    this.remainingTime = this.timedEvent.getRemainingSeconds()
    this.textTimer.setText(`Timer: ${Math.round(this.remainingTime).toString()}`)
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
    this.coinSound.play()
    this.emmiterParticles.start()
    this.target.setY(0);
    this.target.setX(this.getRandomX())
    this.points++
    this.textScore.setText(`Score: ${this.points}`)
  }

  gameOver(){
    this.sys.game.destroy(true)
    if(this.points >= 10){
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "You Win! 😊"
    }
    else{
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "You Lose! 😭"
    }
    gameEndDiv.style.display = "flex"
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

gameStartButton.addEventListener("click", () => {
  gameStartDiv.style.display = "none"
  game.scene.resume("scene-game")
})

gameEndButton.addEventListener("click", () => {
  location.reload()
})
