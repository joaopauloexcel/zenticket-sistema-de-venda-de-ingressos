export class People {
    id?:number;
    nome: string;
    email: string;
    rua: string;
    numero: string;
    bairro:string;
    complemento:string;
    cidade:string;
    estado:string;
    cep:string;
    senha: string;
    permissao: string;

    constructor() {
        this.id = null;
        this.nome = '';
        this.email = '';
        this.rua = '';
        this.numero = '';
        this.bairro = '';
        this.complemento = '';
        this.cidade = '';
        this.estado = '';
        this.cep = '';
        this.senha = '';
        this.permissao = '';
    }
}