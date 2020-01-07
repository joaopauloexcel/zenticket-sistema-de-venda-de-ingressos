export class Inscricoes {
    id?:number;
    eventId:number 
    peopleId:number
    data:string
    qtd:string

    constructor(eventID: number, peopleId: number, data:string, qtd:string) {
        this.eventId = eventID;
        this.peopleId = peopleId;
        this.data = data;
        this.qtd = qtd
    }
}