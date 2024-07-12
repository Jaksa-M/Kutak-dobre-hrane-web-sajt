import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor(private servisLogin: LoginService, private router: Router){}
  login(){
    const pass = this.servisLogin.hashPassword(this.password)
    this.servisLogin.login(this.username, pass).subscribe(
      data=>{
        if(data==null) this.message = "Korisnik sa unetim kredencijalima ne postoji"
        else if(data.username == "") this.message = "Nije uneto korisnicko ime"
        else if(data.password == "") this.message = "Nije uneta lozinka"
        else {
          if(data.type == "administrator"){
            this.router.navigate(['administrator'])
          }
          else{
            this.message = "Administrator sa tim imenom ili lozinkom ne postoji u bazi"
          }
        }
      }
    )
  }

  message: string = ""
  username: string
  password: string
}
