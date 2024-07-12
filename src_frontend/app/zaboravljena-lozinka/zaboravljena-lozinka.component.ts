import { Component } from '@angular/core';
import { LozinkaService } from '../services/lozinka.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-zaboravljena-lozinka',
  templateUrl: './zaboravljena-lozinka.component.html',
  styleUrls: ['./zaboravljena-lozinka.component.css']
})
export class ZaboravljenaLozinkaComponent {
  constructor(private servis: LozinkaService, private servisLogin: LoginService, private router: Router){}

  promeniLozinku(): void{
    if(this.regexPass(this.newPass) == false) {
      return
    }
    if(this.newPass != this.repeatNewPass){
      this.message = "Nova sifra i ponovljena nova sifra moraju biti iste"
      return
    }
    const hashpass = this.servisLogin.hashPassword(this.newPass)
    this.servis.promeniLozinku(this.username, this.user.password, hashpass).subscribe(
      data =>{
        alert(data.message)
        this.router.navigate([''])
      }
    )
  }

  async nextStep(): Promise<void> {
    if (this.step == 0) {
      await this.getUser()
      if(this.user == null){
        console.log("cao")
        return
      }
    } else if (this.step == 1) {
      if (this.answer != this.user.answer) {
        this.message = "Netacan odgovor"
        return
      }
      this.message = ""
    }
    this.step++
  }

  getUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.servis.getUser(this.username).subscribe(
        data => {
          if (data == null) {
            this.message = "Korisnicko ime ne postoji"
            this.user = null
            resolve() // Resolving the promise
            return
          }
          this.user = data
          resolve()
        },
        error => {
          console.error('Error fetching user:', error);
          reject(error) // Rejecting the promise in case of error
        }
      )
    })
  }

  regexPass(pass: string): boolean{
    let atleast1Number: RegExp =  /^(?=.*\d)/
    let min6Max10: RegExp = /^.{6,10}$/
    let atleast1BigLetter: RegExp = /^(?=.*[A-Z])/
    let startingLetter = /^[a-zA-Z]/
    let atleast1SpecChar = /^(?=.*[\W_])/
    let atleast3LittleLetters = /^(?=(?:.*[a-z]){3})/

    if(min6Max10.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati izmedju 6 i 10 karaktera"
      return false
    }
    if(atleast1BigLetter.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedno veliko slovo"
      return false
    }
    if(atleast1Number.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedan broj"
      return false
    }
    if(atleast1SpecChar.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedan specijalni karakter"
      return false
    }
    if(atleast3LittleLetters.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar tri mala slova"
      return false
    }
    if(startingLetter.test(pass) == false){
      this.passMessage = "Lozinka mora poceti slovom"
      return false
    }
    this.passMessage = ""
    return true
  }

  username: string
  message: string = ""
  currPass: string
  newPass: string
  repeatNewPass: string
  step: number = 0
  user: User
  answer: string
  passMessage: string = ""
}
