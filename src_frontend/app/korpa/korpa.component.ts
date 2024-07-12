import { Component, OnInit } from '@angular/core';
import { Korpa } from '../models/korpa';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-korpa',
  templateUrl: './korpa.component.html',
  styleUrls: ['./korpa.component.css']
})
export class KorpaComponent implements OnInit {
  korpa: Korpa

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (window.history.state.korpa) {
        this.korpa = window.history.state.korpa as Korpa
        this.removeDuplicates()
      }
    })
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

  incrementAmount(index: number): void {
    this.korpa.amounts[index]++;
  }

  decrementAmount(index: number): void {
    if (this.korpa.amounts[index] > 0) {
      this.korpa.amounts[index]--;
    }
  }

  removeItem(index: number): void {
    this.korpa.jela.splice(index, 1);
    this.korpa.amounts.splice(index, 1);
  }

  goBack(): void{
    localStorage.setItem("Korpa", JSON.stringify(this.korpa))
    this.router.navigate(['restoran/restoran-jelovnik'])
  }
}
