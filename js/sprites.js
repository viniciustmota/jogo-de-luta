const gravity = 0.6

const floorHeight = 96

const backgroundSpritePath = "../assets/background/placeholder.png"
const defaultObjectSpritePath = "../assets/objects/square.svg"
class Sprite {
    constructor({ position, velocity, source, scale, offset, sprites}) {
        this.position = position
        this.velocity = velocity
        this.scale = scale || 1
        this.image = new Image()
        this.image.src = source || defaultObjectSpritePath

        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.offset = offset ||  {
            x: 0,
            y: 0
        }

        this.sprites = sprites || {
            idle: {
                src: this.image.src,
                totalSpriteFrames: 1,
                framesPerSpriteFrame: 1,
            }
        }

        this.currentSprite = this.sprites.idle

        this.elapsedTime = 0
        this.currentSpriteFrame = 0
        this.totalSpriteFrames = this.sprites.idle.totalSpriteFrames
        this.framesPerSpriteFrame = this.sprites.idle.framesPerSpriteFrame
    }

    setSprite(sprite){
        this.currentSprite = this.sprites[sprite]

        if(!this.currentSprite){
            this.currentSprite = this.sprites.idle
        }
    }

    laodSprite(sprite){
        let previousSprite = this.image.src
        
        this.image = new Image()
        this.image.src = this.currentSprite.src
        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames
        this.framesPerSpriteFrame = this.currentSprite.framesPerSpriteFrame

        let newSprite = this.image.src

        if(previousSprite !== newSprite){
            let previousSpriteImage = new Image()
            previousSpriteImage.src = previousSprite

            this.position.y += (previousSpriteImage.height - this.image.height) * this.scale
        }
    }

    draw() {
        ctx.imageSmoothingEnabled = false

        const xScale = this.facing === "left" ? -1 : 1

        ctx.save()
        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y)
        ctx.scale(xScale, 1)

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * this.image.width / this.totalSpriteFrames,
            0,
            this.image.width / this.totalSpriteFrames,
            this.image.height,
            0,
            0,
            this.width / this.totalSpriteFrames,
            this.height,
        )

        ctx.restore()
    }

    animate(){
        this.elapsedTime++

        if(this.elapsedTime >= this.framesPerSpriteFrame) {
            this.currentSpriteFrame++

            if(this.currentSpriteFrame >= this.totalSpriteFrames) {
                this.currentSpriteFrame = 0
            }

            this.elapsedTime = 0
        }
    }

    update() {
        this.draw()
        this.animate()
    }

    attack(){
        if(this.onAttackCooldown) return
        this.isAttacking = true
        this.onAttackCooldown = true

        setTimeout(() => {
            this.isAttacking = false
        }, 100)

        setTimeout(() => {
            this.onAttackCooldown = false
        }, this.attackCooldown)
    }

    jump() {
        if(!this.onGround) return
        player.velocity.y = -16
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity,
        sprites,
        scale
    }) {
        super({
            position,
            velocity,
            scale,
            sprites
        })

        this.velocity = velocity

        this.isAttacking
        this.attackCooldown = 500
        this.onAttackCooldown

        this.lastKeyPressed
        this.onGround
    }

    gravity(){
        if(Math.ceil(this.position.y + this.height >= canvas.height)){
            this.onGround = true
        }else{
            this.onGround = false
        }

        if(this.position.y + this.height > canvas.height){
            this.position.y = canvas.height - this.height
            this.velocity.y = 0
        }else {
            if(!this.onGround) this.velocity.y += gravity
        }
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    update() {
        this.gravity()
        this.laodSprite()

        this.draw()
        this.animate()
    }
}

const player = new Fighter({
    position: {
        x: 100,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    scale: 4,
    sprites: {
        idle: {
            src: "../assets/player/idle.png",
            totalSpriteFrames: 11,
            framesPerSpriteFrame: 18,
        },
        running: {
            src: "../assets/player/running.png",
            totalSpriteFrames: 10,
            framesPerSpriteFrame: 8,
        },
        jumping: {
            src: "../assets/player/jumping.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8,
        },
        attacking: {
            src: "../assets/player/attacking.png",
            totalSpriteFrames: 7,
            framesPerSpriteFrame: 8,
        },
    }
})

// const player2 = new Fighter({
//     position: {
//         x: 500,
//         y: 100
//     },
//     velocity: {
//         x: 0,
//         y: 0
//     },
//     dimensions: {
//         width: 50,
//         height: 200
//     }
// })

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    source: backgroundSpritePath
})