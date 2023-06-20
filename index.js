const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravidade = 0.7

const background = new Modelo({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const loja = new Modelo({
    position: {
        x: 600,
        y: 160
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    frameMax: 6
})

const jogador1 = new Samurai({
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
    },
    imageSrc: './img/samuraiMack/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: {
        x:205,
        y:155
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            frameMax: 8,
            image: new Image()
        },
        pulo: {
            imageSrc: './img/samuraiMack/Jump.png',
            frameMax: 2,
        },
        queda: {
            imageSrc: './img/samuraiMack/Fall.png',
            frameMax: 2,
        },
        ataque1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            frameMax: 6,
        },
        tomarDano: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4,
        },
        morte: {
            imageSrc: './img/samuraiMack/Death.png',
            frameMax: 6,
        },
    },
    attackBox:{
        offset: {
            x: 100,
            y: 50,
        },
        with: 160,
        height: 50
    }
})

const jogador2 = new Samurai({
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
    },
    imageSrc: './img/kenji/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: {
        x:205,
        y:165
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frameMax: 8,
            image: new Image()
        },
        pulo: {
            imageSrc: './img/kenji/Jump.png',
            frameMax: 2,
            image: new Image()
        },
        queda: {
            imageSrc: './img/kenji/Fall.png',
            frameMax: 2,
            image: new Image()
        },
        ataque1: {
            imageSrc: './img/kenji/Attack1.png',
            frameMax: 4,
            image: new Image()
        },
        tomarDano: {
            imageSrc: './img/kenji/Take hit.png',
            frameMax: 3,
            image: new Image()
        },
        morte: {
            imageSrc: './img/kenji/Death.png',
            frameMax: 7,
        },
    },
    attackBox:{
        offset: {
            x: -162,
            y: 50,
        },
        with: 150,
        height: 50
    }
})


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
ContagemRegressiva()

function animacao(){
    window.requestAnimationFrame(animacao)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.atualiza()
    loja.atualiza()
    c.fillStyle = 'rgb(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    jogador1.atualiza()
    jogador2.atualiza()

    jogador1.velocity.x = 0
    jogador2.velocity.x = 0

    //movimentos do jogador
    if (keys.a.pressed && jogador1.lastKey === 'a'){
        jogador1.velocity.x = -5
        jogador1.mudarSprites('run')
    } else if (keys.d.pressed && jogador1.lastKey === 'd'){
        jogador1.velocity.x = 5
        jogador1.mudarSprites('run')
    } else {
        jogador1.mudarSprites('idle')
    }
    //pulo
    if(jogador1.velocity.y < 0) {
        jogador1.mudarSprites('pulo')
    } else if (jogador1.velocity.y > 0) {
        jogador1.mudarSprites('queda')
    }

    //movimetos do inimigo
    if (keys.ArrowLeft.pressed && jogador2.lastKey === 'ArrowLeft'){
        jogador2.velocity.x = -5
        jogador2.mudarSprites('run')
    }else if (keys.ArrowRight.pressed && jogador2.lastKey === 'ArrowRight'){
        jogador2.velocity.x = 5
        jogador2.mudarSprites('run')
    } else {
        jogador2.mudarSprites('idle')
    }

    //pulo
    if(jogador2.velocity.y < 0) {
        jogador2.mudarSprites('pulo')
    } else if (jogador2.velocity.y > 0) {
        jogador2.mudarSprites('queda')
    }

    //detector de colisão dos golpes
    if (contatoDeGolpe({
        rectangle1: jogador1,
        rectangle2: jogador2
    }) &&
        jogador1.isAttacKing
        ) {
            jogador2.tomarDano()
            jogador1.isAttacKing = false
            gsap.to('#vidaJ2', {
                width: jogador2.vida +'%'
            })
    }

    //se o jogador errar
    if(jogador1.isAttacKing && jogador1.FrameAtual === 4) {
        jogador1.isAttacKing = false
    }

    if (contatoDeGolpe({
        rectangle1: jogador2,
        rectangle2: jogador1
    }) &&
        jogador2.isAttacKing && jogador2.FrameAtual === 2
        ) {
            jogador1.tomarDano()
            jogador2.isAttacKing = false
            gsap.to('#vidaJ1', {
                width: jogador1.vida +'%'
            })
    }

    //se o jogador errar
    if(jogador2.isAttacKing && jogador2.FrameAtual === 4) {
        jogador2.isAttacKing = false
    }
    // jogo termina quando um morre
    if (jogador1.vida <= 0 || jogador2.vida <= 0 ){
        DeterminarGanhador({jogador1, jogador2, tempoId})
    }
}

animacao()

window.addEventListener('keydown', (event) =>{
    if (!jogador1.morte) {
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
            case 's':
                jogador1.ataca()
                break        
        }
    }
   
    if (!jogador2.morte) {
        switch(event.key) {
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
                jogador2.ataca()
                break
    }
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