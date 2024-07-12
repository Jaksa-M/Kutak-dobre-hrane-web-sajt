import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Restoran } from '../models/restoran';
import { GostService } from '../services/gost.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { Rezervacija } from '../models/rezervacija';

@Component({
  selector: 'app-gost',
  templateUrl: './gost.component.html',
  styleUrls: ['./gost.component.css']
})
export class GostComponent implements OnInit{
  constructor(private servis: GostService, private servisLogin: LoginService, private router: Router){}
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("User"))
      this.dohvRestorane()
      this.dohvRezervacije()
  }

  dohvRestorane(): void{
    this.servisLogin.dohvRestorane().subscribe(
      data =>{
        this.restorani = data
        for(let i = 0; i < data.length; i++){
          this.average_grades[i] = 0
          for(let j = 0; j < data[i].grades.length; j++){
            this.average_grades[i] += data[i].grades[j]
          }
          this.average_grades[i] /= data[i].grades.length
        }
      }
    )
  }

  search(): void{
    this.searchedRestorani = []
    for(let i = 0; i < this.restorani.length; i++){
      let flag: boolean = true
      if(this.searchName != ""){
        const regex1 = new RegExp(this.searchName);
        flag = regex1.test(this.restorani[i].name);
        if(flag == false) continue
      }
      if(this.searchAddress != ""){
        const regex2 = new RegExp(this.searchAddress);
        flag = regex2.test(this.restorani[i].address);
        if(flag == false) continue
      }
      if(this.searchType != ""){
        const regex3 = new RegExp(this.searchType);
        flag = regex3.test(this.restorani[i].type);
      }
      if(flag == true) this.searchedRestorani.push(this.restorani[i])
    }
  }

  azuriraj(): void{
    this.router.navigate(['azuriranje']);
  }

  dohvRezervacije(): void{
    this.servis.dohvRezervacije().subscribe(
      data =>{
        this.rezervacije = data
        this.rezervacije.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        for (let i = 0; i < this.rezervacije.length; i++) {
          this.dohvAdresu(this.rezervacije[i].restoran)
          const currentTime = new Date()
          const reservationTime = this.parseTimeString(this.rezervacije[i].date, this.rezervacije[i].time)
          const timeDiff = reservationTime.getTime() - currentTime.getTime()
          const minutesDiff = Math.floor(timeDiff / (1000 * 60))
          if(minutesDiff >= 0){
            this.minutesDiffArr.push(minutesDiff)
            this.aktuelneRezervacije.push(this.rezervacije[i])
          }
          else{
            this.istekleRezervacije.push(this.rezervacije[i])
          }
        }
      }
    )
  }

  parseTimeString(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  dohvAdresu(restoranIme: string){
    this.servis.dohvAdresu(restoranIme).subscribe(
      data =>{
        this.adrese.push(data.message)
      }
    )
  }

  otkazi(rezervacija: Rezervacija): void{
    const currentTime = new Date()
    const reservationTime = this.parseTimeString(rezervacija.date, rezervacija.time)

    const timeDiff = reservationTime.getTime() - currentTime.getTime()

    const minutesDiff = Math.floor(timeDiff / (1000 * 60))

    for(let i = 0; i < this.aktuelneRezervacije.length; i++){
      if(this.aktuelneRezervacije[i] == rezervacija) {
        this.minutesDiffArr[i] = minutesDiff
        break
      }
    }

    if (minutesDiff >= 45) {
      this.servis.otkazi(rezervacija).subscribe((data) => {
        alert(data.message);
        this.dohvRezervacije()
      });
    }
  }

  user: User
  restorani: Restoran[] = []
  searchName: string = ""
  searchAddress: string = ""
  searchType: string = ""
  searchedRestorani: Restoran[] = []
  average_grades: number[] = []
  rezervacije: Rezervacija[]
  aktuelneRezervacije: Rezervacija[] = []
  istekleRezervacije: Rezervacija[] = []
  adrese: string[] = []
  minutesDiffArr: number[] = []
}
