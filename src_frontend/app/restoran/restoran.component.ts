import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import { Rezervacija } from '../models/rezervacija';
import * as Leaf from 'leaflet';
import { CanvasElement } from '../models/canvas';
import { Jelo } from '../models/jelo';
import { Korpa } from '../models/korpa';
import { User } from '../models/user';

@Component({
  selector: 'app-restoran',
  templateUrl: './restoran.component.html',
  styleUrls: ['./restoran.component.css']
})
export class RestoranComponent{

}
