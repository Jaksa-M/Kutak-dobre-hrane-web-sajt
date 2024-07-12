import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Restoran } from '../models/restoran';
import { Rezervacija } from '../models/rezervacija';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  hashPassword(pass: string){
    const hash = CryptoJS.SHA256(pass)
    const ret = hash.toString(CryptoJS.enc.Hex)
    return ret
  }

  login(username: string, password: string){
    const data={
      username: username,
      password: password
    }
    return this.http.post<User>("http://localhost:4000/login", data)
  }

  register(formData: FormData) {
    return this.http.post<Message>("http://localhost:4000/register", formData);
  }

  dohvRestorane(){
    return this.http.get<Restoran[]>("http://localhost:4000/dohvRestorane")
  }

  dohvKonobara(uname: string){
    const data = {
      username: uname
    }
    return this.http.post<User>("http://localhost:4000/dohvKonobara", data)
  }

  dohvGoste(){
    return this.http.get<User[]>("http://localhost:4000/dohvGoste")
  }

  dohvRezervacije(){
    return this.http.get<Rezervacija[]>("http://localhost:4000/dohvRezervacije")
  }

  checkUsername(u: string){
    const data = {
      username: u
    }
    return this.http.post<boolean>("http://localhost:4000/checkUsername", data)
  }

  checkMail(m: string){
    const data = {
      mail: m
    }
    return this.http.post<boolean>("http://localhost:4000/checkMail", data)
  }
}
