const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravidade = 0.7

class Modelo {
    constructor({ position: posicao, velocity: velocidade, color: cor = 'red', offset }){
        this.position = posicao
        this.velocity = velocidade
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = cor
        this.isAttacKing
    }

    projeta(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacKing) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    atualiza(){
        this.projeta()
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        

        this.position.x = this.position.x + this.velocity.x
        this.position.y = this.position.y + this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y = this.velocity.y + gravidade
        }
    }

    ataca() {
        this.isAttacKing = true
        setTimeout(() => {
            this.isAttacKing = false
        }, 100)
    }
}

const jogador1 = new Modelo({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const jogador2 = new Modelo({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

console.log(jogador1)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function contatoDeGolpe({ rectangle1, rectangle2 }) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animacao(){
    window.requestAnimationFrame(animacao)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    jogador1.atualiza()
    jogador2.atualiza()

    jogador1.velocity.x = 0
    jogador2.velocity.x = 0

    //movimentos do jogador
    if (keys.a.pressed && jogador1.lastKey === 'a'){
        jogador1.velocity.x = -5
    }else if (keys.d.pressed && jogador1.lastKey === 'd'){
        jogador1.velocity.x = 5
    }

    //movimetos do inimigo
    if (keys.ArrowLeft.pressed && jogador2.lastKey === 'ArrowLeft'){
        jogador2.velocity.x = -5
    }else if (keys.ArrowRight.pressed && jogador2.lastKey === 'ArrowRight'){
        jogador2.velocity.x = 5
    }

    //detector de colisão dos golpes
    if (contatoDeGolpe({
        rectangle1: jogador1,
        rectangle2: jogador2
    }) &&
        jogador1.isAttacKing) {
            jogador1.isAttacKing = false
    }

    if (contatoDeGolpe({
        rectangle1: jogador2,
        rectangle2: jogador1
    }) &&
        jogador2.isAttacKing) {
            jogador2.isAttacKing = false
    }
}

animacao()

window.addEventListener('keydown', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            jogador1.lastKey = 'd'
            break

        case 'a':
            keys.a.pressed = true
            jogador1.lastKey = 'a'
            break
        case 'w':
            if(jogador1.velocity.y === 0){
                jogador1.velocity.y = -20
            }else{
                break
            }
            break
        case ' ':
            jogador1.ataca()
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            jogador2.lastKey = 'ArrowRight'
            break
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            jogador2.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if(jogador2.velocity.y === 0){
                jogador2.velocity.y = -20
            }else{
                break
            }
            break
        case 'ArrowDown':
            jogador2.isAttacKing = true
            break
    }
    
})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})