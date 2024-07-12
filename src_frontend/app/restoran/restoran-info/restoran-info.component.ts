import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restoran } from 'src/app/models/restoran';
import { RestoranService } from 'src/app/services/restoran.service';
import * as Leaf from 'leaflet';

@Component({
  selector: 'app-restoran-info',
  templateUrl: './restoran-info.component.html',
  styleUrls: ['./restoran-info.component.css']
})
export class RestoranInfoComponent {
  constructor(private route: ActivatedRoute, private servis: RestoranService){}
  ngOnInit(): void {
    this.restoranName = localStorage.getItem("RestoranName")
    this.restoranInfo()
  }

  restoranInfo(): void{
    this.servis.restoranInfo(this.restoranName).subscribe(
      data =>{
        this.restoran = data
        this.initializeMap()
      }
    )
  }

  initializeMap(): void {
    const apiKey = 'vxwfJMPVbZjSrTlaqlL9';
    const map = Leaf.map('map').setView([49.2125578, 16.62662018], 14); // Initial position
    Leaf.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      crossOrigin: true
    }).addTo(map);

    this.obtainCoordinates(this.restoran.address).then(coords => {
      Leaf.marker(coords).addTo(map)
        .bindPopup(this.restoran.address)
        .openPopup();
    }).catch(err => {console.error('Greska pri preuzimanju koordinata:', err);});
  }

  async obtainCoordinates(address: string): Promise<[number, number]> {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
    const data = await resp.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    } else {
      throw new Error('Adresa nije pronadjena');
    }
  }

  restoranName: string
  restoran: Restoran
}
