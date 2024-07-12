import { Component, OnInit } from '@angular/core';
import { Narudzbina } from 'src/app/models/narudzbina';
import { User } from 'src/app/models/user';
import { KonobarService } from 'src/app/services/konobar.service';

@Component({
  selector: 'app-konobar-dostave',
  templateUrl: './konobar-dostave.component.html',
  styleUrls: ['./konobar-dostave.component.css']
})
export class KonobarDostaveComponent implements OnInit {
  constructor(private servis: KonobarService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("User"))
    this.dohvNarudzbine()
  }

  dohvNarudzbine(): void {
    this.narudzbine = []
    this.servis.dohvNarudzbine().subscribe(
      data => {
        for(let i = 0; i < data.length; i++){
          if(data[i].status == "neobradjena" && data[i].restoran == this.user.restaurant){
            this.narudzbine.push(data[i])
          }
        }
      }
    );
  }

  potvrdi(narudzbina: Narudzbina): void {
    this.selectedNarudzbina = narudzbina
  }

  odbij(narudzbina: Narudzbina): void {
    narudzbina.status = "odbijena"
    this.servis.odbijNarudzbinu(narudzbina).subscribe(
      data => {
        this.dohvNarudzbine()
      }
    );
  }

  potvrdiSaVremenom(): void {
    if (this.selectedNarudzbina && this.selectedTime) {
      this.selectedNarudzbina.expectedTime = this.selectedTime
      this.selectedNarudzbina.status = "potvrdjena"
      const currentDate = new Date()
      this.selectedNarudzbina.date = currentDate.toISOString()
      this.servis.potvrdiNarudzbinu(this.selectedNarudzbina).subscribe(
        data => {
          this.dohvNarudzbine()
          this.selectedNarudzbina = null
          this.selectedTime = ''
        }
      )
    }
  }

  toggleSelect(narudzbina: Narudzbina): void {
    if (this.selectedNarudzbina === narudzbina) {
      this.selectedNarudzbina = null;
    } else {
      this.selectedNarudzbina = narudzbina;
      this.selectedTime = ''; // Reset selected time
    }
  }

  user: User
  narudzbine: Narudzbina[] = []
  selectedNarudzbina: Narudzbina | null = null
  selectedTime: string = ''
}
