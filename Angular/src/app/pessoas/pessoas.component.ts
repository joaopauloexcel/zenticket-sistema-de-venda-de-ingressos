import { Component, OnInit } from '@angular/core';
import { People } from '../model/people';
import { Router, ActivatedRoute } from '@angular/router';
import { CepService } from '../services/cep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';
import { PeopleCrmService } from '../services/people-crm.service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  image: any
  pessoas: People[]=[];
  pessoa: People;
  modalTitle: string;
  roles:any=''
  role:any=''
  search:any
  userEmail:any
  id:any
  nameMessage:any
  mail:any
  post:any={
    title:'',
    text:'',
    email:''
  }
  form:any={
    title:'',
    text:'',
    name:'',
    receptEmail:'',
    emiterEmail:'',
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private peopleService:PeopleService, 
              private servicecep:CepService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private tokenService: TokenService,
              private peopleCrmService: PeopleCrmService,
              private tokenStorage: TokenService,
              private authService: AuthService)
   {
      this.pessoa = new People();
   }

  ngOnInit() {
    if(this.tokenService.getToken()){
      this.search=''
      this.mail=this.tokenService.getUsername()
      this.roles=this.tokenService.getAuthorities()
      this.selectPeople();
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

email(name, email){
  this.form.emiterEmail = this.userEmail;
  this.form.name=name
  this.form.receptEmail=email
  this.nameMessage=name
}

sendEmail(){
  this.peopleCrmService.sendEmail(this.form)
  .subscribe(res => {
    this.toastr.success("E-mail com Sucesso!")
     }, (err) => {
       this.toastr.error("Erro!")
     })
}

message(id, name){
  this.post.email = this.tokenService.getUsername();
  this.id=id
  this.nameMessage=name
}

sendMsg(){
  this.peopleCrmService.sendMsg(this.id,this.post)
          .subscribe(res => {
            console.log(res);
            this.toastr.success("Mensagem enviada com Sucesso!")
            }, (err) => {
              this.toastr.error("Erro!")
            })
}

  searchRoles(){
    this.selectPeople()
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

  buscarCep(){
    try{
      if(this.pessoa.cep.length==8){
        this.servicecep.getCep(this.pessoa.cep)
        .subscribe(res => 
          {
            console.log(JSON.parse(JSON.stringify(res)))
            this.pessoa.bairro=JSON.parse(JSON.stringify(res)).bairro
            this.pessoa.cidade=JSON.parse(JSON.stringify(res)).localidade
            this.pessoa.estado=JSON.parse(JSON.stringify(res)).uf
            this.pessoa.rua=JSON.parse(JSON.stringify(res)).logradouro
            console.log(this.pessoa)
          }
        )
      }
    }catch{
      console.log('Provavelmente está desconectado da internet')
    }
  }

  selectPeople(){
    this.peopleService.getUser(this.role, this.search)
    .subscribe(res => {
      this.pessoas = res;
      console.log(this.pessoas);
      //this.isLoadingResults = false;
    }, err => {
      console.log(err);
      //this.isLoadingResults = false;
    });
  }

  searchUser(){
    this.peopleService.getUserFilterName(this.search)
      .subscribe(res => {        
        this.pessoas = res;
      }, err => {
        console.log(err);
      });
   }

   updatePessoa(p){
        this.pessoa.id = p.id;
        this.pessoa.nome = p.nome;
        this.pessoa.email = p.email;
        this.pessoa.rua = p.rua;
        this.pessoa.numero = p.numero;
        this.pessoa.bairro = p.bairro;
        this.pessoa.complemento = p.complemento;
        this.pessoa.cidade = p.cidade;
        this.pessoa.estado = p.estado;
        this.pessoa.cep = p.cep;
        this.pessoa.senha = p.senha;
        this.pessoa.permissao = p.permissao;
   }

  save(){
    if(this.pessoa.id==null){
      this.peopleService.postUser(this.pessoa)
      .subscribe(res => {
        this.toastr.success("Cadastrado efetuado com Sucesso!")
          this.selectPeople(); 
          this.modalService.dismissAll()
        }, (err) => {
          this.toastr.error(err)
        });
    }
    else
    {
      console.log(this.pessoa.id);
      this.peopleService.updateUser(this.pessoa.id, this.pessoa)
        .subscribe(res => {
          this.toastr.success("Cadastrado efetuado com Sucesso!")
            this.selectPeople(); 
            this.modalService.dismissAll()
            //this.router.navigate(['/produto-detalhe/' + this._id]);
          }, (err) => {
            this.toastr.error(err)
          }
        )
    }
   }
  
  deletePeople() {
    console.log(this.pessoa.id);
    this.peopleService.deleteUser(this.pessoa.id)
      .subscribe(res => {
          this.selectPeople(); 
          //this.router.navigate(['/usuarios']);
        }, (err) => {
          console.log(err);
        }
      )
    this.toastr.success("Excluido com Sucesso!")
    this.modalService.dismissAll()
  }

  newPeople(){
    this.pessoa.id = null,
    this.pessoa.nome = null;
    this.pessoa.email = null;
    this.pessoa.rua = null;
    this.pessoa.numero = null;
    this.pessoa.bairro = null;
    this.pessoa.complemento = null;
    this.pessoa.cidade = null;
    this.pessoa.estado = null;
    this.pessoa.cep = null;
    this.pessoa.senha = null;
    this.pessoa.permissao = null;
  }
}


