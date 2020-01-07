import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../auth/token-service';
import { Router } from '@angular/router';
import { InscricoesService } from '../services/inscricoes.service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-acessos',
  templateUrl: './acessos.component.html',
  styleUrls: ['./acessos.component.css']
})
export class AcessosComponent implements OnInit {

  search:any
  roles:any
  userEmail:any
  email:any
  inscricoes:any
  inscricao:any={
    id:null,
    eventId:null,
    peopleId:null,
    data:'',
    qtd:''
  }
  
  constructor(private authService: AuthService, private apiInscricao:InscricoesService, private router: Router,
    private modalService:NgbModal, private toastr: ToastrService, private tokenService: TokenService, private tokenStorage: TokenService) { 
  }

  ngOnInit() {
    if(this.tokenService.getToken()){
      this.roles=this.tokenService.getAuthorities()
      this.email=this.tokenStorage.getUsername()
      this.search=''
      this.getInscricao()
    }else{
      this.router.navigate(['login']);
    }
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
    this.router.navigate(['home']);
  }

  getInscriSearch(){
    this.getInscricao()
  }

  exportPDF(){
    this.apiInscricao.exportPDF(this.inscricao.id)
  }

  getInscricao(){
    try{
      this.apiInscricao.getInscricao(this.search)
      .subscribe(res => {  
        console.log(res)   
        console.log("Premissao1:",this.roles)   
        this.inscricoes = res;
      }, err => {
      });
    }catch{
       console.log('Faça o login com token válido para ser exibido as mensagens')
    }
  }

  clearInscricao(){
    this.inscricao.id = null,
    this.inscricao.eventId = null,
    this.inscricao.peopleId = null,
    this.inscricao.data = '',
    this.inscricao.qtd = ''
  }

  updateInscricao(n){
    this.inscricao.id = n.id
  }

  deleteInscricao(){
    this.apiInscricao.deleteInscricao(this.inscricao.id)
    .subscribe(res => {
      this.toastr.success("Excluido com Sucesso!")
      this.modalService.dismissAll()
      this.getInscricao();
    }, err => {
      console.log(err);
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
