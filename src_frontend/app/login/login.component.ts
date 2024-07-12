import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Restoran } from '../models/restoran';
import { User } from '../models/user';
import { Rezervacija } from '../models/rezervacija';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(private servis: LoginService, private router: Router){}
  ngOnInit(): void {
    this.dohvRestorane()
    this.dohvGoste()
    this.dohvRezervacije()
  }

  login(){
    if(this.username == "") this.message = "Nije uneto korisnicko ime"
    else if(this.password == "") this.message = "Nije uneta lozinka"
    const pass = this.servis.hashPassword(this.password)
    this.servis.login(this.username, pass).subscribe(
      data=>{
        if(data==null) this.message = "Korisnik ne postoji"
        else if(data.active == false) this.message = "Zabranjen pristup sistemu"
        else {
          localStorage.setItem("User", JSON.stringify(data))
          if(data.type == "gost"){
            this.router.navigate(['gost/gost-profil'])
          }
          else if(data.type == "konobar"){
            this.router.navigate(['konobar/konobar-profil'])
          }
          else{
            this.message = "Takav korisnik u bazi ne postoji"
          }
        }
      }
    )
  }

  dohvRestorane(): void{
    this.servis.dohvRestorane().subscribe(
      data =>{
        this.restorani = data
        this.dohvKonobare()
      }
    )
  }

  dohvGoste(): void{
    this.servis.dohvGoste().subscribe(
      data =>{
        this.gosti = data
      }
    )
  }

  dohvRezervacije(): void{
    this.servis.dohvRezervacije().subscribe(
      data =>{
        this.rezervacije = data
        this.rez24h = this.rezervacije24h()
        this.rez7d = this.rezervacije7d()
        this.rez30d = this.rezervacije30d()
      }
    )
  }

  rezervacije24h(): number {
    const currentDate = new Date()
    const last24h = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
    return this.rezervacije.filter(
      (rezervacija) => new Date(rezervacija.date) > last24h
    ).length
  }

  rezervacije7d(): number {
    const currentDate = new Date()
    const last7d = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    return this.rezervacije.filter(
      (rezervacija) => new Date(rezervacija.date) > last7d
    ).length
  }

  rezervacije30d(): number {
    const currentDate = new Date()
    const last30d = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    return this.rezervacije.filter(
      (rezervacija) => new Date(rezervacija.date) > last30d
    ).length
  }

  registracija(): void{
    this.router.navigate(['register'])
  }

  sort(item: string): void{
    if(item == "name"){
      this.restorani.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if(item == "type"){
      this.restorani.sort((a, b) => a.type.localeCompare(b.type));
    }
    else if(item == "address"){
      this.restorani.sort((a, b) => a.address.localeCompare(b.address));
    }
  }

  async dohvKonobare(): Promise<void> {
    for(let i = 0; i < this.restorani.length; i++){
      const restoran = this.restorani[i]
      const konobari: User[] = []
      for(let j = 0; j < restoran.konobar.length; j++){
        try {
          const data = await this.servis.dohvKonobara(restoran.konobar[j]).toPromise()
          konobari.push(data)
        } catch (error) {
          console.error('Greska prilikom dohvatanja konobara:', error)
        }
      }
      this.restoranKonobariMap.set(restoran.name, konobari)
    }
  }

  getKonobariNames(restoranName: string): string {
    const konobari = this.restoranKonobariMap.get(restoranName)
    if (konobari) {
      return konobari.map(konobar => konobar.firstname + ' ' + konobar.lastname).join(', ')
    }
    return ''
  }

  search(): void {
    this.searchedRestorani = [];
    for (let i = 0; i < this.restorani.length; i++) {
      let flag: boolean = true
      if (this.searchName !== "") {
        const regex1 = new RegExp(this.searchName)
        flag = regex1.test(this.restorani[i].name)
        if (!flag) continue
      }
      if (this.searchAddress !== "") {
        const regex2 = new RegExp(this.searchAddress)
        flag = regex2.test(this.restorani[i].address)
        if (!flag) continue
      }
      if (this.searchType !== "") {
        const regex3 = new RegExp(this.searchType)
        flag = regex3.test(this.restorani[i].type)
      }
      if (flag) this.searchedRestorani.push(this.restorani[i])
    }
  }

  username: string
  password: string
  message: string = ""
  restorani: Restoran[] = []
  gosti: User[] = []
  rezervacije: Rezervacija[] = []
  rez24h: number
  rez7d: number
  rez30d: number
  searchName: string = ""
  searchAddress: string = ""
  searchType: string = ""
  searchedRestorani: Restoran[] = []
  restoranKonobariMap: Map<string, User[]> = new Map()
}
