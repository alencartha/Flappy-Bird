//this deixa a variavel visivel globalmente
 
// parametros: nome da tag que eu quero criar e o nome da classe que eu vou atribuir
function novoElemento(tagName, className){
    const element = document.createElement(tagName);
    element.className = className;
    return element
}

function Barreira (reversa =false){
    //esse é o elemento que estou chamando em outras funções
    this.elemento= novoElemento("div", "barreira");

    const borda= novoElemento("div", "borda");
    const corpo= novoElemento("div", "corpo");
    this.elemento.appendChild(reversa? corpo : borda)
    this.elemento.appendChild(reversa? borda : corpo)

    this.valorAltura = altura => corpo.style.height =`${altura}px`
}

function ParDeBarreiras (altura, abertura, x){
    this.elemento = novoElemento("div", "par-de-barreiras")

    this.superior= new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.SortearAbertura=()=>{
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.valorAltura(alturaSuperior)
        this.inferior.valorAltura(alturaInferior)
    }
    //saber o valor de x
    this.getX=()=>parseInt(this.elemento.style.left.split("px")[0])

    //alterar o x a partir do valor que foi passado no get
    this.setX= x =>this.elemento.style.left=`${x}px`;

    this.getLargura=()=>this.elemento.clientWidth;

    this.SortearAbertura()
    this.setX(x)
}

const b = new ParDeBarreiras(700,300,300)
document.querySelector("[wm-flappy]").appendChild(b.elemento)