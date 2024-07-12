import { Component, OnInit } from '@angular/core';
import { Narudzbina } from 'src/app/models/narudzbina';
import { User } from 'src/app/models/user';
import { GostService } from 'src/app/services/gost.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gost-dostavahrane',
  templateUrl: './gost-dostavahrane.component.html',
  styleUrls: ['./gost-dostavahrane.component.css'],
  providers: [DatePipe]
})
export class GostDostavahraneComponent implements OnInit{
  constructor(private servis: GostService, private datePipe: DatePipe){}
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("User"))
      this.dohvNarudzbineGost()
  }

  dohvNarudzbineGost(): void {
    this.aktuelneDostave = []
    this.prethodneDostave = []
    const currentDate = new Date()
    this.servis.dohvNarudzbineGost(this.user.username).subscribe(
      data => {
        for(let i = 0; i < data.length; i++){
          if(data[i].status == "potvrdjena"){
            const orderDate = new Date(data[i].date)
            const expectedTime = data[i].expectedTime
            const upperBound = parseInt(expectedTime.split('-')[1])
            const estimatedEndDate = new Date(orderDate.getTime() + upperBound * 60000)

            if(estimatedEndDate < currentDate){
              this.prethodneDostave.push(data[i])
            } else {
              this.aktuelneDostave.push(data[i])
            }
          }
        }
        this.prethodneDostave.sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          return dateB.getTime() - dateA.getTime()
        })
      }
    )
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss')
  }

  formatDateWithoutTime(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy')
  }

  user: User
  aktuelneDostave: Narudzbina[] = []
  prethodneDostave: Narudzbina[] = []
}
