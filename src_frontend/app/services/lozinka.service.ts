import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LozinkaService {

  constructor(private http: HttpClient) { }

  promeniLozinku(uname: string, pass: string, newPass: string){
    const data = {
      username: uname,
      password: pass,
      newPass: newPass
    }
    return this.http.post<Message>("http://localhost:4000/promeniLozinku", data)
  }

  getUser(uname: string){
    const data = {
      username: uname
    }
    return this.http.post<User>("http://localhost:4000/getUser", data)
  }

  dalje(uname: string, pass: string){
    const data = {
      username: uname,
      password: pass
    }
    return this.http.post<User>("http://localhost:4000/dalje", data)
  }
}
