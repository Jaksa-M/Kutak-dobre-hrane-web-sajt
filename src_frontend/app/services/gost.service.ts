import { Injectable } from '@angular/core';
import { Rezervacija } from '../models/rezervacija';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Narudzbina } from '../models/narudzbina';

@Injectable({
  providedIn: 'root'
})
export class GostService {

  constructor(private http: HttpClient) { }

  dohvRezervacije(){
    return this.http.get<Rezervacija[]>("http://localhost:4000/restoran/dohvRezervacije")
  }

  dohvSvojeRezervacije(u: User){
    return this.http.post<Rezervacija[]>("http://localhost:4000/restoran/dohvSvojeRezervacije", u)
  }

  otkazi(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/otkazi", rezervacija)
  }

  dohvAdresu(restoranIme: string){
    const data = {
      name: restoranIme
    }
    return this.http.post<Message>("http://localhost:4000/restoran/dohvAdresu", data)
  }

  oceni(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/oceni", rezervacija)
  }

  dohvNarudzbineGost(uname: string){
    const data = {
      username: uname
    }
    return this.http.post<Narudzbina[]>("http://localhost:4000/restoran/dohvNarudzbineGost", data)
  }
}
