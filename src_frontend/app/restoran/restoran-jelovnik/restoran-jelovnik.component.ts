import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Jelo } from 'src/app/models/jelo';
import { Korpa } from 'src/app/models/korpa';
import { Narudzbina } from 'src/app/models/narudzbina';
import { Restoran } from 'src/app/models/restoran';
import { User } from 'src/app/models/user';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-restoran-jelovnik',
  templateUrl: './restoran-jelovnik.component.html',
  styleUrls: ['./restoran-jelovnik.component.css']
})
export class RestoranJelovnikComponent {
  constructor(private router: Router, private route: ActivatedRoute, private servis: RestoranService){}
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("User"))
    this.restoranName = localStorage.getItem("RestoranName")
    this.restoranInfo()
    this.korpa = JSON.parse(localStorage.getItem("Korpa"))
    if(this.korpa == null) this.korpa = new Korpa()
  }

  restoranInfo(): void{
    this.servis.restoranInfo(this.restoranName).subscribe(
      data =>{
        this.restoran = data
        this.kolicina = new Array(this.restoran.menu.length).fill(0)
      }
    )
  }

  dodajUKorpu(jelo: Jelo, index: number): void{
    this.korpa.jela.push(jelo)
    this.korpa.amounts.push(this.kolicina[index])
    this.kolicina[index] = 0
    this.removeDuplicates()
  }

  pregledajKorpu(): void{
    this.router.navigate(['korpa'], { state: { korpa: this.korpa } })
  }

  zavrsiNarudzbinu(): void{
    this.narudzbina = new Narudzbina()
    this.narudzbina.korpa = this.korpa
    this.narudzbina.restoran = this.restoranName
    this.narudzbina.status = "neobradjena"
    this.narudzbina.expectedTime = ""
    this.narudzbina.name = this.user.username
    const currentDate = new Date()
    this.narudzbina.date = currentDate.toISOString()
    this.narudzbina.total_price = 0
    for(let i = 0; i < this.korpa.jela.length; i++){
      this.narudzbina.total_price += this.korpa.jela[i].price * this.korpa.amounts[i]
    }
    this.servis.zavrsiNarudzbinu(this.narudzbina).subscribe(
      data =>{
        this.korpa = new Korpa()
        localStorage.removeItem("Korpa")
        alert(data.message)
      }
    )
  }

  removeDuplicates(): void {
    const newJela = []
    const newAmounts = []

    for (let i = 0; i < this.korpa.jela.length; i++) {
      const jelo = this.korpa.jela[i]
      const amount = this.korpa.amounts[i]

      let existingIndex = -1
      for (let j = 0; j < newJela.length; j++) {
        if (newJela[j].name === jelo.name) {
          existingIndex = j
          break
        }
      }

      if (existingIndex != -1) { // Duplicate item found
        newAmounts[existingIndex] += amount
      } else { // Unique item, add it to consolidated arrays
        newJela.push(jelo)
        newAmounts.push(amount)
      }
    }

    this.korpa.jela = newJela
    this.korpa.amounts = newAmounts
  }

  restoranName: string
  restoran: Restoran
  korpa: Korpa = new Korpa()
  kolicina: number[] = []
  user: User
  narudzbina: Narudzbina
}
