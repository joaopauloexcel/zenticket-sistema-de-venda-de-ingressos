import { Component } from '@angular/core';
import { TokenService } from './auth/token-service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  roles: any='';
  userEmail:any

  constructor(private tokenStorage: TokenService, private router: Router, private authService: AuthService) { 
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      console.log('logou')
      this.authService.login = true;
      setTimeout(() => {
      }, 1000);
      this.roles = this.tokenStorage.getAuthorities();
      console.log('e-mail: ', this.roles)
    }
    else 
    {
      this.router.navigate(['home']);
      console.log('e-mail: ', this.roles)
    }
  }
}
