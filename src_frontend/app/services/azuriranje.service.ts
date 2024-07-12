import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AzuriranjeService {

  constructor(private http: HttpClient) { }

  potvrdi(formData: FormData){
    return this.http.post<User>("http://localhost:4000/potvrdi", formData)
  }

}
