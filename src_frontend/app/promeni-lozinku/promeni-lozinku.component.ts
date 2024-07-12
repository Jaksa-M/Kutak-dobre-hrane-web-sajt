import { Component } from '@angular/core';
import { LozinkaService } from '../services/lozinka.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-promeni-lozinku',
  templateUrl: './promeni-lozinku.component.html',
  styleUrls: ['./promeni-lozinku.component.css']
})
export class PromeniLozinkuComponent {
  constructor(private servis: LozinkaService, private servisLogin: LoginService){}

  promeniLozinku(): void{
    if(this.regexPass(this.newPass) == false) {
      return
    }
    if(this.newPass != this.repeatNewPass){
      this.message = "Nova sifra i ponovljena nova sifra moraju biti iste"
      return
    }
    const hashpass = this.servisLogin.hashPassword(this.newPass)
    this.servis.promeniLozinku(this.username, this.currPass, hashpass).subscribe(
      data =>{
        alert(data.message)
      }
    )
  }

  dalje(): void{
    const hashpass = this.servisLogin.hashPassword(this.currPass)
    this.servis.dalje(this.username, hashpass).subscribe(
      data => {
        if(data == null){
          this.message = "Korisnik sa datim korisnickim imenom i lozinkom ne postoji"
          return
        }
        this.prikazi = true
      }
    )
  }

  regexPass(pass: string): boolean{
    let min6Max10: RegExp = /^.{6,10}$/
    let atleast1BigLetter: RegExp = /^(?=.*[A-Z])/
    let atleast1Number: RegExp =  /^(?=.*\d)/
    let startingLetter = /^[a-zA-Z]/
    let atleast3LittleLetters = /^(?=(?:.*[a-z]){3})/
    let atleast1SpecChar = /^(?=.*[\W_])/

    if(min6Max10.test(pass) == false){
      this.message = "Lozinka mora sadrzati izmedju 6 i 10 karaktera"
      return false
    }
    if(atleast1BigLetter.test(pass) == false){
      this.message = "Lozinka mora sadrzati bar jedno veliko slovo"
      return false
    }
    if(atleast1Number.test(pass) == false){
      this.message = "Lozinka mora sadrzati bar jedan broj"
      return false
    }
    if(atleast1SpecChar.test(pass) == false){
      this.message = "Lozinka mora sadrzati bar jedan specijalni karakter"
      return false
    }
    if(atleast3LittleLetters.test(pass) == false){
      this.message = "Lozinka mora sadrzati bar tri mala slova"
      return false
    }
    if(startingLetter.test(pass) == false){
      this.message = "Lozinka mora poceti slovom"
      return false
    }
    this.message = ""
    return true
  }

  username: string
  message: string = ""
  currPass: string
  newPass: string
  repeatNewPass: string
  prikazi: boolean = false
}
