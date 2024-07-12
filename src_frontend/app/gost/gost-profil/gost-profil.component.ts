import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-gost-profil',
  templateUrl: './gost-profil.component.html',
  styleUrls: ['./gost-profil.component.css']
})
export class GostProfilComponent {
  constructor(private router: Router){}
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("User"))
  }

  azuriraj(): void{
    this.router.navigate(['azuriranje']);
  }

  user: User
}
