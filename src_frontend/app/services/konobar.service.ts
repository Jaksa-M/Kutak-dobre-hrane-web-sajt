import { Injectable } from '@angular/core';
import { Restoran } from '../models/restoran';
import { HttpClient } from '@angular/common/http';
import { Rezervacija } from '../models/rezervacija';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Narudzbina } from '../models/narudzbina';

@Injectable({
  providedIn: 'root'
})
export class KonobarService {

  constructor(private http: HttpClient) { }

  dohvRestoran(u: string){
    const data = {
      username: u
    }
    return this.http.post<Restoran>("http://localhost:4000/restoran/dohvRestoran", data)
  }

  dohvRezervacije(){
    return this.http.get<Rezervacija[]>("http://localhost:4000/restoran/dohvRezervacije")
  }

  dohvRezervacijeKonobar(usr: User){
    return this.http.post<Rezervacija[]>("http://localhost:4000/restoran/dohvRezervacijeKonobar", usr)
  }

  dohvRezervacijeRestoran(restoran: Restoran){
    return this.http.post<Rezervacija[]>("http://localhost:4000/restoran/dohvRezervacijeRestoran", restoran)
  }

  potvrdi(rez: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/potvrdi", rez)
  }

  odbi(rez: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/odbi", rez)
  }

  sePojavio(rez: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/sePojavio", rez)
  }

  produzi(rez: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/produzi", rez)
  }

  dohvNarudzbine(){
    return this.http.get<Narudzbina[]>("http://localhost:4000/restoran/dohvNarudzbine")
  }

  potvrdiNarudzbinu(narudzbina: Narudzbina) {
    return this.http.post<Message>("http://localhost:4000/restoran/potvrdiNarudzbinu", narudzbina);
  }

  odbijNarudzbinu(narudzbina: Narudzbina){
    return this.http.post<Message>("http://localhost:4000/restoran/odbijNarudzbinu", narudzbina);
  }

}
