import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Restoran } from 'src/app/models/restoran';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-gost-restorani',
  templateUrl: './gost-restorani.component.html',
  styleUrls: ['./gost-restorani.component.css']
})
export class GostRestoraniComponent {
  constructor(private servisLogin: LoginService, private router: Router){}
  ngOnInit(): void {
      this.dohvRestorane()
  }

  dohvRestorane(): void {
    this.servisLogin.dohvRestorane().subscribe(
      data => {
        this.restorani = data
        this.calculateAverageGrades()
        this.dohvKonobare()
      }
    );
  }

  calculateAverageGrades(): void {
    this.average_grades = this.restorani.map(restoran => {
      if (restoran.grades.length == 0) {
        return 0
      }
      const sum = restoran.grades.reduce((a, b) => a + b, 0)
      return sum / restoran.grades.length
    })
  }

  async dohvKonobare(): Promise<void> {
    for(let i = 0; i < this.restorani.length; i++){
      const restoran = this.restorani[i]
      const konobari: User[] = []
      for(let j = 0; j < restoran.konobar.length; j++){
        try {
          const data = await this.servisLogin.dohvKonobara(restoran.konobar[j]).toPromise()
          konobari.push(data)
        } catch (error) {
          console.error('Greska prilikom dohvatanja konobara:', error)
        }
      }
      this.restoranKonobariMap.set(restoran.name, konobari)
    }
  }

  getKonobariNames(restoranName: string): string {
    const konobari = this.restoranKonobariMap.get(restoranName)
    if (konobari) {
      return konobari.map(konobar => konobar.firstname + ' ' + konobar.lastname).join(', ')
    }
    return ''
  }

  search(): void {
    this.searchedRestorani = [];
    for (let i = 0; i < this.restorani.length; i++) {
      let flag: boolean = true
      if (this.searchName !== "") {
        const regex1 = new RegExp(this.searchName)
        flag = regex1.test(this.restorani[i].name)
        if (!flag) continue
      }
      if (this.searchAddress !== "") {
        const regex2 = new RegExp(this.searchAddress)
        flag = regex2.test(this.restorani[i].address)
        if (!flag) continue
      }
      if (this.searchType !== "") {
        const regex3 = new RegExp(this.searchType)
        flag = regex3.test(this.restorani[i].type)
      }
      if (flag) this.searchedRestorani.push(this.restorani[i])
    }

    // Calculate average grades for searched results
    this.average_grades = this.searchedRestorani.map(restoran => {
      if (restoran.grades.length == 0) {
        return 0
      }
      const sum = restoran.grades.reduce((a, b) => a + b, 0)
      return sum / restoran.grades.length
    });
  }

  navigateToRestoranInfo(restoranName: string): void{
    localStorage.setItem("RestoranName", restoranName)
    this.router.navigate(['restoran/restoran-info'])
  }

  restorani: Restoran[] = []
  searchName: string = ""
  searchAddress: string = ""
  searchType: string = ""
  searchedRestorani: Restoran[] = []
  average_grades: number[] = []
  restoranKonobariMap: Map<string, User[]> = new Map()
}
