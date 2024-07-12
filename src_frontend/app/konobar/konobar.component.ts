import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Restoran } from '../models/restoran';
import { KonobarService } from '../services/konobar.service';
import { Rezervacija } from '../models/rezervacija';
import { CanvasElement } from '../models/canvas';

@Component({
  selector: 'app-konobar',
  templateUrl: './konobar.component.html',
  styleUrls: ['./konobar.component.css']
})
export class KonobarComponent{

}
