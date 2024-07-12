import { Injectable } from '@angular/core';
import { Restoran } from '../models/restoran';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { Rezervacija } from '../models/rezervacija';
import { Observable } from 'rxjs';
import { Korpa } from '../models/korpa';
import { Narudzbina } from '../models/narudzbina';

@Injectable({
  providedIn: 'root'
})
export class RestoranService {
  constructor(private http: HttpClient) { }

  restoranInfo(restoranName: string){
    const data = {
      name: restoranName
    }
    return this.http.post<Restoran>("http://localhost:4000/restoran/restoranInfo", data)
  }

  rezervisi(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restoran/rezervisi", rezervacija)
  }

  dohvRezervacije(){
    return this.http.get<Rezervacija[]>("http://localhost:4000/restoran/dohvRezervacije")
  }

  zavrsiNarudzbinu(narduzbina: Narudzbina){
    return this.http.post<Message>("http://localhost:4000/restoran/zavrsiNarudzbinu", narduzbina)
  }

  updateCanvas(restoran: Restoran){
    return this.http.post<Message>("http://localhost:4000/restoran/updateCanvas", restoran)
  }
}
