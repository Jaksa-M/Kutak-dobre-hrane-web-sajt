import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Restoran } from 'src/app/models/restoran';
import { Rezervacija } from 'src/app/models/rezervacija';
import { User } from 'src/app/models/user';
import { KonobarService } from 'src/app/services/konobar.service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-konobar-statistika',
  templateUrl: './konobar-statistika.component.html',
  styleUrls: ['./konobar-statistika.component.css']
})
export class KonobarStatistikaComponent implements OnInit {
  constructor(private servis: KonobarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User'))
    this.dohvRezervacijeKonobar()
    this.dohvRestoran()
  }

  dohvRezervacijeKonobar(): void {
    this.servis.dohvRezervacijeKonobar(this.user).subscribe(data => {
      this.rezervacije = data;
      this.processData();
    });
  }

  dohvRezervacijeRestoran(): void {
    this.servis.dohvRezervacijeRestoran(this.restoran).subscribe(data => {
      this.rezervacijeRestoran = data;
      this.processKonobarData();
      this.cdr.detectChanges();  // Manually trigger change detection
      this.calculateAverageReservations();
      this.calculateReservationsByDate();
      this.generateBarChart();
    });
  }

  dohvRestoran(): void {
    this.servis.dohvRestoran(this.user.username).subscribe(data => {
      this.restoran = data;
      this.dohvRezervacijeRestoran();
    });
  }

  barChartLabels: string[] = [];

  processData(): void {
    this.rezervacije.forEach(rezervacija => {
      const date = new Date(rezervacija.date).toLocaleDateString('en-GB');
      if (!this.guestsByDay[date]) {
        this.guestsByDay[date] = 0;
        this.barChartLabels.push(date);
      }
      this.guestsByDay[date] += rezervacija.people;
    });
  }

  processKonobarData(): void {
    this.rezervacijeRestoran.forEach(rezervacija => {
      if (!this.konobarCount[rezervacija.konobar]) {
        this.konobarCount[rezervacija.konobar] = 0;
        this.konobarColors[rezervacija.konobar] = this.getRandomColor();  // Precompute color
      }
      this.konobarCount[rezervacija.konobar]++;
    });
  }

  getMaxGuests(): number {
    return Math.max(...Object.values(this.guestsByDay));
  }

  getKonobarNames(): string[] {
    return Object.keys(this.konobarCount);
  }

  getKonobarValues(): number[] {
    return Object.values(this.konobarCount);
  }

  getPieSliceColor(konobar: string): string {
    return this.konobarColors[konobar];
  }

  generatePieSlicePath(index: number): string {
    const totalReservations = Object.values(this.konobarCount).reduce((a, b) => a + b, 0);
    const konobarNames = Object.keys(this.konobarCount);
    const startAngle = konobarNames.slice(0, index).reduce((acc, konobar) => acc + (this.konobarCount[konobar] / totalReservations) * 2 * Math.PI, 0);
    const endAngle = startAngle + (this.konobarCount[konobarNames[index]] / totalReservations) * 2 * Math.PI;
    const radius = 16; // Set your desired radius
    const x = 16; // Center X coordinate
    const y = 16; // Center Y coordinate

    // Generate pie slice path using arc
    const path = [
      `M ${x} ${y}`, // Move to center
      `L ${x + radius * Math.cos(startAngle)} ${y + radius * Math.sin(startAngle)}`, // Line to starting point
      `A ${radius} ${radius} 0 ${(endAngle - startAngle) > Math.PI ? 1 : 0} 1 ${x + radius * Math.cos(endAngle)} ${y + radius * Math.sin(endAngle)}`, // Arc to endpoint
      `Z` // Close path
    ];

    return path.join(' '); // Join path segments
  }



  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // calculateAverageReservations(): void {
  //   const reservationsByDayOfWeek: { [key: string]: Rezervacija[] } = {};

  //   // Initialize the reservationsByDayOfWeek object
  //   for (let i = 0; i < 7; i++) {
  //     const dayOfWeek = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' });
  //     reservationsByDayOfWeek[dayOfWeek] = [];
  //   }

  //   // Filter reservations for the last 24 months
  //   const currentDate = new Date();
  //   const last24MonthsDate = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());
  //   const filteredReservations = this.rezervacijeRestoran.filter(reservation => new Date(reservation.date) >= last24MonthsDate);

  //   // Group reservations by day of the week
  //   filteredReservations.forEach(reservation => {
  //     const dayOfWeek = new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long' });
  //     reservationsByDayOfWeek[dayOfWeek].push(reservation);
  //   });

  //   const averages = [];
  //   // Calculate the average reservations for each day of the week
  //   for (const dayOfWeek in reservationsByDayOfWeek) {
  //     if (reservationsByDayOfWeek.hasOwnProperty(dayOfWeek)) {
  //       const totalReservations = reservationsByDayOfWeek[dayOfWeek].length;
  //       const averageReservations = totalReservations / 8; // Divide by number of weeks in the last 24 months (approximately)
  //       this.histogramData.push({ dayOfWeek, averageReservations });
  //     }
  //   }
  //   this.maxAverageReservations = Math.max(...averages); // Calculate max average reservations
  // }

  histogramData: { dayOfWeek: string, averageReservations: number }[] = []
  calculateAverageReservations(): void {
    const reservationsByDayOfWeek: { [key: string]: Rezervacija[] } = {};

    // Initialize the reservationsByDayOfWeek object
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 0; i < 7; i++) {
      reservationsByDayOfWeek[dayNames[i]] = [];
    }

    // Filter reservations for the last 24 months
    const currentDate = new Date();
    const last24MonthsDate = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());
    const filteredReservations = this.rezervacijeRestoran.filter(reservation => new Date(reservation.date) >= last24MonthsDate);

    // Group reservations by day of the week
    filteredReservations.forEach(reservation => {
      const dayOfWeek = new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long' });
      reservationsByDayOfWeek[dayOfWeek].push(reservation);
    });

    // Calculate the average reservations for each day of the week
    for (const dayOfWeek in reservationsByDayOfWeek) {
      if (reservationsByDayOfWeek.hasOwnProperty(dayOfWeek)) {
        const totalReservations = reservationsByDayOfWeek[dayOfWeek].length;
        const averageReservations = totalReservations / 8; // Divide by number of weeks in the last 24 months (approximately)
        this.histogramData.push({ dayOfWeek, averageReservations });
      }
    }

    // Call generateHistogram() after calculating data
    this.generateHistogram();
  }


  generateHistogram(): void {
    const ctx = document.getElementById('histogramCanvas') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'],
        datasets: [{
          label: 'Prosecan broj rezervacija',
          data: this.histogramData.map(data => data.averageReservations),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Change the orientation of the bars
        scales: {
          x: {
            beginAtZero: true // Start the x-axis at zero
          }
        }
      }
    });
  }

  calculateReservationsByDate(): void {
    this.reservationsByDate = {}; // Reset reservationsByDate

    this.rezervacije.forEach(reservation => {
      const date = new Date(reservation.date).toLocaleDateString('en-GB');
      if (!this.reservationsByDate[date]) {
        this.reservationsByDate[date] = 0;
      }
      this.reservationsByDate[date]++;
    });
  }

  generateBarChart(): void {
    const ctx = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.reservationsByDate),
        datasets: [{
          label: 'Broj rezervacija',
          data: Object.values(this.reservationsByDate),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Broj rezervacija'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Datum'
            }
          }
        }
      }
    });
  }

  rezervacije: Rezervacija[] = [];
  rezervacijeRestoran: Rezervacija[] = [];
  user: User;
  restoran: Restoran;
  guestsByDay: { [key: string]: number } = {};
  konobarCount: { [key: string]: number } = {};
  konobarColors: { [key: string]: string } = {};
  maxAverageReservations: number;
  reservationsByDate: { [key: string]: number } = {};
}
