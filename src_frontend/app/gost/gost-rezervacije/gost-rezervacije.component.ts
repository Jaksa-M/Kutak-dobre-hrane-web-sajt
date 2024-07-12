import { Component } from '@angular/core';
import { Rezervacija } from 'src/app/models/rezervacija';
import { User } from 'src/app/models/user';
import { GostService } from 'src/app/services/gost.service';

@Component({
  selector: 'app-gost-rezervacije',
  templateUrl: './gost-rezervacije.component.html',
  styleUrls: ['./gost-rezervacije.component.css']
})
export class GostRezervacijeComponent {
  constructor(private servis: GostService){}
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("User"))
    this.dohvSvojeRezervacije()
  }

  dohvSvojeRezervacije(): void{
    this.aktuelneRezervacije = []
    this.istekleRezervacije = []
    this.servis.dohvSvojeRezervacije(this.user).subscribe(
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
        this.dohvSvojeRezervacije()
      });
    }
  }

  openRatingForm(rezervacija: Rezervacija): void {
    this.selectedRezervacija = rezervacija
    this.showPopupForm = true
  }

  closePopupForm(): void {
    this.selectedRezervacija.grade = -1
    this.selectedRezervacija.comment = ""
    this.showPopupForm = false
  }

  oceni(): void {
    this.servis.oceni(this.selectedRezervacija).subscribe(response => {
      this.dohvSvojeRezervacije()
      this.closePopupForm()
    });
  }

  onRatingSelected(stars: number): void {
    this.selectedStars = stars;
  }

  user: User
  rezervacije: Rezervacija[]
  aktuelneRezervacije: Rezervacija[] = []
  istekleRezervacije: Rezervacija[] = []
  adrese: string[] = []
  minutesDiffArr: number[] = []
  selectedStars: number = 0
  showPopupForm: boolean = false
  selectedRezervacija: Rezervacija
}
