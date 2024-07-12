import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { KonobarComponent } from './konobar/konobar.component';
import { GostComponent } from './gost/gost.component';
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
import { StarRatingComponent } from './star-rating/star-rating.component';
import { StarGostComponent } from './gost/star-gost/star-gost.component';
import { AdminLoginComponent } from './administrator/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    KonobarComponent,
    GostComponent,
    AdministratorComponent,
    RegisterComponent,
    RestoranComponent,
    AzuriranjeComponent,
    PromeniLozinkuComponent,
    ZaboravljenaLozinkaComponent,
    KorpaComponent,
    GostProfilComponent,
    GostRestoraniComponent,
    GostRezervacijeComponent,
    GostDostavahraneComponent,
    KonobarProfilComponent,
    KonobarRezervacijeComponent,
    KonobarDostaveComponent,
    KonobarStatistikaComponent,
    RestoranInfoComponent,
    RestoranRezervacijaComponent,
    RestoranJelovnikComponent,
    StarRatingComponent,
    StarGostComponent,
    AdminLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
