import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from '../model/login-info';
import { AuthService } from '../services/auth-service';
import { TokenService } from '../auth/token-service';
import { Router } from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { People } from '../model/people';
import { PeopleService } from '../services/people.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})

export class LoginComponent implements OnInit {
  pessoa: People;
  form: any = {};
  loginForm:any;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles: any;
  public loading = false;
  private loginInfo: AuthLoginInfo;
  //class_user = 'form-control is-invalid'
  //class_user = 'form-control is-valid'
  //class_password = 'form-control is-invalid'
  //class_password = 'form-control is-valid'
  class_email = 'form-control'
  class_password = 'form-control'

  constructor(private authService: AuthService, 
  private servicecep: PeopleService,
  private tokenStorage: TokenService, 
  private router: Router,
  private peopleService:PeopleService,
  private toastr: ToastrService,
  private modalService: NgbModal,
  public formBuilder: FormBuilder) {
    this.pessoa = new People();
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailValid)]],
      senha: ['', Validators.compose([Validators.minLength(5),
      Validators.required])],})
    }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {//Se houver token definido
        this.isLoggedIn = true;//habilita boolean de logado
        this.roles = this.tokenStorage.getAuthorities();//lê a atual permissão do usuário
    }
  }

  onSubmit(){
    this.class_email = 'form-control'
    this.class_password = 'form-control'
    let{email, senha} = this.loginForm.controls
    if(this.loginForm.valid){
      this.loginInfo = new AuthLoginInfo(//Instancia objeto já com as informações de login do usuário preenchidos no formulário
      this.form.email,
      this.form.senha);      
      this.authService.attemptAuth(this.loginInfo).subscribe(//Chama a service que tenta realizar o login
      data => {
        this.tokenStorage.saveToken(data.accessToken);//Cria token no cabeçalho de requisição
        this.tokenStorage.saveUsername(data.username);//salva usuário no cabeçalho de requisição
        this.tokenStorage.saveAuthorities(data.authorities);//salva autorização desse usuário no cabeçalho de autenticação
        this.isLoginFailed = false;//desabilita boolean de falha na autenticação
        this.isLoggedIn = true;//habilita boolean de autenticação
        this.roles = this.tokenStorage.getAuthorities();//lê a autorização desse usuário e a armazena na variável roles
        this.authService.login = true;                       
        this.router.navigate(['home'])
        this.loading= false         
      },
      error => {//se erro, retorna a mensagem
        this.toastr.error("E-mail ou Senha incorretos!")
        this.errorMessage = error.error.reason;
        this.isLoginFailed = true;//habilita o boolean de falha na autenticação
        this.loading = false;
      }
    )
  }
  else if(!email.valid){
    this.toastr.error("E-mail inválido")
  }
  else if(!senha.valid){
    this.toastr.error("A senha deve conter no mmínimo 6 caracteres")
  }
  else{
    this.toastr.error("Erro de conexão com o servidor")
  }
  if(email.valid){
    this.class_email = 'form-control is-valid'
  }else{
    this.class_email = 'form-control is-invalid'
  }
  if(senha.valid){
    this.class_password = 'form-control is-valid'
  }else{
    this.class_password = 'form-control is-invalid'
  }
}

openLg(content) {
  this.modalService.open(content, { size: 'lg', backdrop : 'static'});
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
  this.pessoa.permissao = '1';
  }

save(){
    this.peopleService.postUser(this.pessoa)
    .subscribe(res => {
      this.toastr.success("Cadastrado efetuado com Sucesso!")
        this.modalService.dismissAll()
      }, (err) => {
        this.toastr.error("Ocorreu algum erro!")
      });
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
}




