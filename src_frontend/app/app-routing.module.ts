import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GostComponent } from './gost/gost.component';
import { KonobarComponent } from './konobar/konobar.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { RegisterComponent } from './register/register.component';
import { RestoranComponent } from './restoran/restoran.component';
import { AzuriranjeComponent } from './azuriranje/azuriranje.component';
import { PromeniLozinkuComponent } from './promeni-lozinku/promeni-lozinku.component';
import { ZaboravljenaLozinkaComponent } from './zaboravljena-lozinka/zaboravljena-lozinka.component';
import { KorpaComponent } from './korpa/korpa.component';
import { GostProfilComponent } from './gost/gost-profil/gost-profil.component';
import { GostRestoraniComponent } from './gost/gost-restorani/gost-restorani.component';
import { GostRezervacijeComponent } from './gost/gost-rezervacije/gost-rezervacije.component';
import { GostDostavahraneComponent } from './gost/gost-dostavahrane/gost-dostavahrane.component';
import { KonobarProfilComponent } from './konobar/konobar-profil/konobar-profil.component';
import { KonobarRezervacijeComponent } from './konobar/konobar-rezervacije/konobar-rezervacije.component';
import { KonobarDostaveComponent } from './konobar/konobar-dostave/konobar-dostave.component';
import { KonobarStatistikaComponent } from './konobar/konobar-statistika/konobar-statistika.component';
import { RestoranInfoComponent } from './restoran/restoran-info/restoran-info.component';
import { RestoranRezervacijaComponent } from './restoran/restoran-rezervacija/restoran-rezervacija.component';
import { RestoranJelovnikComponent } from './restoran/restoran-jelovnik/restoran-jelovnik.component';
import { AdminLoginComponent } from './administrator/admin-login/admin-login.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "gost", component: GostComponent,
    children: [
      {path: "gost-profil", component: GostProfilComponent},
      {path: "gost-restorani", component: GostRestoraniComponent},
      {path: "gost-rezervacije", component: GostRezervacijeComponent},
      {path: "gost-dostavahrane", component: GostDostavahraneComponent}
    ]
  },
  {path: "konobar", component: KonobarComponent,
    children: [
      {path: "konobar-profil", component: KonobarProfilComponent},
      {path: "konobar-rezervacije", component: KonobarRezervacijeComponent},
      {path: "konobar-dostave", component: KonobarDostaveComponent},
      {path: "konobar-statistika", component: KonobarStatistikaComponent}
    ]
  },
  {path: "administrator", component: AdministratorComponent},
  {path: "adminlogin", component: AdminLoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "restoran", component: RestoranComponent,
    children: [
      {path: "restoran-info", component: RestoranInfoComponent},
      {path: "restoran-rezervacija", component: RestoranRezervacijaComponent},
      {path: "restoran-jelovnik", component: RestoranJelovnikComponent}
    ]
  },
  {path: "azuriranje", component: AzuriranjeComponent},
  {path: "promeniLozinku", component: PromeniLozinkuComponent},
  {path: "zaboravljenaLozinka", component: ZaboravljenaLozinkaComponent},
  {path: "korpa", component: KorpaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
