export class Evento {
    id?:number;
    titulo: string;
    descricao: string;
    data: string;
    local: string;
    hora: string;
    valor: string;

    constructor(titulo: string, descricao: string, local:string, data: string, hora: string, valor:string) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.local = local;
        this.data = data;
        this.hora = hora;
        this.valor = valor;
    }
}