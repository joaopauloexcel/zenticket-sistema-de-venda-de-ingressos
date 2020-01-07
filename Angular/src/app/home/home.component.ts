import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../auth/token-service';
import { EventosService } from '../services/eventos.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { InscricoesService } from '../services/inscricoes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  search:any
  roles:any
  eventos:any
  userEmail:any
  mail:any
  desabilita:any=false
  inscricao:any={
    qtd:''
  }
  evento:any={
    id:null,
    titulo:'',
    descricao:'',
    data:'',
    local:'',
    hora:'',
    valor:''
  }
  valorfinal:any

  constructor(private inscricaoService: InscricoesService, private authService: AuthService, 
    private apiEvento:EventosService, private router: Router, private apiInscricao:InscricoesService,
    private modalService:NgbModal, private toastr: ToastrService, private tokenService: TokenService, private tokenStorage: TokenService) { 
  }

  ngOnInit() {
    this.roles=this.tokenService.getAuthorities()
    this.mail = this.tokenStorage.getUsername()
    this.search=''
    this.getEventos()
  }

  upValor(){
    this.valorfinal=parseFloat(this.inscricao.qtd)*parseFloat(this.evento.valor)
    this.desabilita = true
  }
  
  setinscricao(){
    this.inscricaoService.saveInscricao(this.inscricao,this.mail,this.evento.id)
    .subscribe(res => {
      this.desabilita = false
      this.toastr.success("Compra realizada com Sucesso!")
      this.modalService.dismissAll()
      this.exportPDF()
      }, (err) => {
        this.toastr.success("Erro ao finalizar compra!")
      })
  }

  exportPDF(){
    this.apiInscricao.exportPDF(this.inscricao.id)
  }

  useEmail(){
    this.userEmail = this.tokenStorage.getUsername().split("@")[0]
  }

  login(){
    this.router.navigate(['login']);
  }

  logout() {
    this.tokenStorage.signOut();
    this.authService.login = false;
    this.router.navigate(['login']);
  }

  getEventos(){
    try{
      this.apiEvento.getEvent(this.search)
      .subscribe(res => {  
        console.log(res)   
        console.log("Premissao1:",this.roles)   
        this.eventos = res;
      }, err => {
      });
    }catch{
       console.log('Faça o login com token válido para ser exibido as mensagens')
    }
  }

  clearEvento(){
    this.evento.id = '',
    this.evento.titulo = '',
    this.evento.descricao = '',
    this.evento.data = '',
    this.evento.local = '',
    this.evento.hora = '',
    this.evento.valor = '',
    this.inscricao.qtd=''
  }

  saveEvento(){
    this.apiEvento.saveEvent(this.evento,this.evento.id)
    .subscribe(res => {
      this.toastr.success("Evento inserida com Sucesso!")
      this.modalService.dismissAll()
      this.clearEvento()
      this.getEventos()
      }, (err) => {
        this.toastr.success("Evento com erro!")
      })
  }

  updateEvento(n){
    this.evento.id=n.id
    this.evento.titulo=n.titulo
    this.evento.descricao=n.descricao
    this.evento.data=n.data 
    this.evento.local=n.local 
    this.evento.hora=n.hora 
    this.evento.valor=n.valor
  }

  deleteEvento(){
    this.apiEvento.deleteEvent(this.evento.id)
    .subscribe(res => {
      this.getEventos();
      this.toastr.success("Excluido com Sucesso!")
      this.modalService.dismissAll()
    }, err => {
      console.log(err);
      this.toastr.success("Erro ao excluir!")
    });
  }

  open(content) {
    this.modalService.open(content, { backdrop : 'static'});
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg', backdrop : 'static'});
  }

  showSuccess(msn) {
    this.toastr.success(msn);
  }

  showError(msn) {
    this.toastr.error(msn);
  }

}
