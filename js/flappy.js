


//this deixa a variavel visivel globalmente

// parametros: nome da tag que eu quero criar e o nome da classe que eu vou atribuir
function novoElemento(tagName, className) {
    //constante element vai criar um elemento com a tag html
    const element = document.createElement(tagName);
    //a classe desse objeto será adicionada
    element.className = className;
    return element
}

function Barreira(reversa = false) {
    //esse é o elemento que estou chamando em outras funções
    this.elemento = novoElemento("div", "barreira");

    const borda = novoElemento("div", "borda");
    const corpo = novoElemento("div", "corpo");
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.valorAltura = altura => corpo.style.height = `${altura}px`
}

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento("div", "par-de-barreiras")

    //se a barreira for true, primeiro add  o corpo depois a borda
    this.superior = new Barreira(true)
    //se a barreira for false, primeiro add a borda depois o corpo
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.SortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.valorAltura(alturaSuperior)
        this.inferior.valorAltura(alturaInferior)
    }
    //saber o valor de x
    this.getX = () => parseInt(this.elemento.style.left.split("px")[0])

    //alterar o x a partir do valor que foi passado no get
    this.setX = x => this.elemento.style.left = `${x}px`;

    this.getLargura = () => this.elemento.clientWidth;

    this.SortearAbertura()
    this.setX(x)
}

//parametro: altura do jogo, largura do game, abertura entre as barreiras e o espaço de uma barreira para outra
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]

    //deslocamento dos pixel, 3px
    const deslocamento = 3;
    this.animar = () => {
        //aqui vai passar por cada bar de barreira dentro do array
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando o elemento sair da tela, sortear um novo valor de abertura, posição etc, as barreiras irão ficar em loop
            if (par.getX() < - par.getLargura()) {
                //somar a quantidade de pares, 4 e setar um novo x para ir para o final
                par.setX(par.getX() + espaco * this.pares.length)
                //para que ela tenha aberturas e posições diferentes
                par.SortearAbertura()
            }

            //meio da tela do game
            const meio = largura / 2;
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if (cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo) {
    //se o usuário não estiver pressionando a tecla é false
    let voando = false

    this.elemento = novoElemento("img", "passaro");
    this.elemento.src = "imgs/passaro.png"

    //saber a posição y do passaro
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    //quando qualquer tecla for pressionada, setar a flag voando para true
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        //se estiver voando adiciona 8 ao y, se não tirar -5px
        const novoY = this.getY() + (voando ? 8 : -5)
        //no maximo até a altura do jogo, tamanho do passaro é 60px
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    //posição do passaro no game
    this.setY(alturaJogo / 2)
}


function Progresso() {
    this.elemento = novoElemento("span", "progresso")
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoColidindo(elementoA, elementoB) {
    //definição das areas dos elementos
    //getBoundingClientRect() retorna o tamanho de um elemento e sua posição relativa ao viewport
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    //lado esquerdo do elemento a mais a largura dele vai dar o lado direito, é maior ou igual o lado esquerdo do b?
    const horizontal = a.left + a.width >= b.left

        //ou lado direito de b é maior do que o lado esquerdo de a ?
        && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false;
    barreiras.pares.forEach(ParDeBarreiras => {
        if (!colidiu) {
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estaoColidindo(passaro.elemento, superior)
                || estaoColidindo(passaro.elemento, inferior)
        }
    })

    return colidiu;
}



function FlappyBird() {
    let pontos = 0;
    const areadoJogo = document.querySelector("[wm-flappy]")
    const altura = areadoJogo.clientHeight
    const largura = areadoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 300, 400,
        () => progresso.atualizarPontos(++pontos))

    const passaro = new Passaro(altura)


    areadoJogo.appendChild(progresso.elemento)
    areadoJogo.appendChild(passaro.elemento)

    barreiras.pares.forEach(par => areadoJogo.appendChild(par.elemento))

    this.start = () => {
        //loop do game
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu (passaro, barreiras)){
                clearInterval(temporizador)
            }
        }, 20)
    }

}

function resetarGame(){
    window.location.reload();
}    


new FlappyBird().start()

const callBack = document.getElementById("call-back");
callBack.addEventListener("click", resetarGame);


