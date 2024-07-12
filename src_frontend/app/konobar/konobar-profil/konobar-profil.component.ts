import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-konobar-profil',
  templateUrl: './konobar-profil.component.html',
  styleUrls: ['./konobar-profil.component.css']
})
export class KonobarProfilComponent {
  constructor(private router: Router){}
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("User"))
  }

  azuriraj(): void{
    this.router.navigate(['azuriranje']);
  }

  user: User
}
