import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';
import { Zahtev } from '../models/zahtev';
import { Observable } from 'rxjs';
import { Restoran } from '../models/restoran';
import { Jelo } from '../models/jelo';

interface CanvasElement {
  type: 'table' | 'toilet' | 'kitchen';
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  members?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  constructor(private http: HttpClient) { }

  dohvKorisnike(){
    return this.http.get<User[]>("http://localhost:4000/dohvKorisnike")
  }

  dohvZahteve(){
    return this.http.get<Zahtev[]>("http://localhost:4000/admin/dohvZahteve")
  }

  deaktiviraj(u: User){
    return this.http.post<Message>("http://localhost:4000/admin/deaktiviraj", u)
  }

  odblokiraj(u: User){
    return this.http.post<Message>("http://localhost:4000/admin/odblokiraj", u)
  }

  prihvati(z: Zahtev){
    return this.http.post<Message>("http://localhost:4000/admin/prihvati", z)
  }

  odbi(z: Zahtev){
    return this.http.post<Message>("http://localhost:4000/admin/odbi", z)
  }

  dodajKonobara(u: User){
    return this.http.post<Message>("http://localhost:4000/admin/dodajKonobara", u)
  }

  proveriRestoran(restoran: string){
    const data = {
      name: restoran
    }
    return this.http.post<Restoran>("http://localhost:4000/admin/proveriRestoran", data)
  }

  saveCanvas(formData: FormData): Observable<any> {
    return this.http.post<any>("http://localhost:4000/admin/saveCanvas", formData);
  }

  // saveCanvas(noviRestoran: Restoran): Observable<any> {
  //   return this.http.post<any>("http://localhost:4000/admin/saveCanvas", noviRestoran);
  // }
}
