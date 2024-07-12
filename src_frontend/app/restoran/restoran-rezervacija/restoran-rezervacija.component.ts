import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanvasElement } from 'src/app/models/canvas';
import { Restoran } from 'src/app/models/restoran';
import { Rezervacija } from 'src/app/models/rezervacija';
import { User } from 'src/app/models/user';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-restoran-rezervacija',
  templateUrl: './restoran-rezervacija.component.html',
  styleUrls: ['./restoran-rezervacija.component.css']
})
export class RestoranRezervacijaComponent {
  constructor(private route: ActivatedRoute, private servis: RestoranService){}
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("User"))
    this.restoranName = localStorage.getItem("RestoranName")
    this.restoranInfo()
    this.selectedTable = null
  }

  restoranInfo(): void{
    this.servis.restoranInfo(this.restoranName).subscribe(
      data =>{
        this.restoran = data
        this.loadCanvas();
        this.dohvRezervacije();
      }
    )
  }

  rezervisi(): void{
    const selectedDateTime = new Date(`${this.rezervacija.date}T${this.rezervacija.time}`)
    const currentDateTime = new Date()
    if (selectedDateTime <= currentDateTime) {
      alert('Ne možete rezervisati za prošlo vreme')
      return
    }
    const selectedDayIndex = selectedDateTime.getDay()-1 // This returns a number (0-6) representing the day of the week
    const selectedDay = this.daysOfWeek[selectedDayIndex]
    const workingHours = this.restoran.workingTime[selectedDay]
    if (!workingHours || !this.isWithinWorkingHours(selectedDateTime, workingHours)) {
      alert('Restoran je zatvoren u to vreme')
      return
    }
    this.rezervacija.restoran = this.restoranName
    this.rezervacija.grade = -1
    this.rezervacija.state = "neobradjena"
    this.rezervacija.reservationTime = 3
    this.rezervacija.user = this.user.username
    this.rezervacija.konobar = ""
    this.rezervacija.tableNum = -1 //this means that konobar will make reservation on table
    this.servis.rezervisi(this.rezervacija).subscribe(
      data => {
        alert(data.message)
      }
    )
  }


  loadCanvas(): void {
    this.canvasElements = this.restoran.canvas;
    this.drawCanvasElements();
  }

  drawCanvasElements(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.canvasElements) {
      for (const element of this.canvasElements) {
        this.drawElement(ctx, element);
      }
    }
  }

  handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let clickedElement: CanvasElement = null;

    // Find the clicked canvas element
    for (const element of this.canvasElements) {
      // Check if the click is inside the canvas element
      if (this.isInsideElement(x, y, element)) {
        clickedElement = element;
        break;
      }
    }

    if (clickedElement) {
      this.handleElementClick(clickedElement);
    } else {
      // Deselect all tables if clicked outside any
      this.deselectAllTables();
    }
  }

  drawElement(ctx: CanvasRenderingContext2D, element: CanvasElement): void {
    ctx.beginPath();
    switch (element.type) {
      case 'sto':
        ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial'; // Increase font size for table numbers
        ctx.fillText(`${element.members}`, element.x - 5, element.y + 5);
        break;
      case 'kuhinja':
      case 'toalet':
        ctx.rect(element.x, element.y, element.width, element.height);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial'; // Increase font size for kitchen and toilet labels
        const text = element.type === 'toalet' ? 'Toalet' : 'Kuhinja';
        const textWidth = ctx.measureText(text).width;
        const textX = element.x + (element.width - textWidth) / 2;
        const textY = element.y + (element.height + 16) / 2; // 16 is the font size
        ctx.fillText(text, textX, textY);
        break;
    }
  }

  rezervisi2(): void {
    if (this.selectedTable) {
      const selectedDateTime = new Date(`${this.rezervacija2.date}T${this.rezervacija2.time}`)
      const currentDateTime = new Date()
      if (selectedDateTime <= currentDateTime) {
        alert('Ne možete rezervisati za prošlo vreme')
        return
      }

      let selectedDayIndex = selectedDateTime.getDay()-1
      if(selectedDayIndex == -1) selectedDayIndex = 0
      const selectedDay = this.daysOfWeek[selectedDayIndex]
      const workingHours = this.restoran.workingTime[selectedDay]
      if (!workingHours || !this.isWithinWorkingHours(selectedDateTime, workingHours)) {
        alert('Restoran je zatvoren u to vreme')
        return
      }
      const numberOfPeople = parseInt(prompt('Unesite za koliko ljudi pravite rezervaciju:'), 10)
      if (numberOfPeople != null && numberOfPeople <= this.selectedTable.members) {
        this.selectedTable.selected = false
        this.rezervacija2.restoran = this.restoranName
        this.rezervacija2.grade = -1
        this.rezervacija2.people = numberOfPeople
        this.rezervacija2.request = ""
        this.rezervacija2.comment = ""
        this.rezervacija2.tableNum = this.selectedTable.tableNumber
        this.rezervacija2.state = "neobradjena"
        this.rezervacija2.reservationTime = 3
        this.rezervacija2.user = this.user.username
        this.rezervacija2.konobar = ""
        this.servis.rezervisi(this.rezervacija2).subscribe(
          data => {
            alert(data.message)
            this.dohvRezervacije();
            // Update table colors after making the reservation
            this.updateTableColors(this.rezervacije)
          }
        );
      }
      else{
        alert("Sto ne prihvata toliko ljudi")
      }
    } else {
      alert('Izaberite sto');
    }
  }

  updateCanvasInDatabase(): void {
    // Send the updated canvas (with reserved tables marked as red) to the server to update the database
    this.servis.updateCanvas(this.restoran).subscribe(
      data => {
        alert(data.message);
      },
      error => {
        console.error('Error updating canvas:', error);
      }
    );
  }

  isInsideElement(x: number, y: number, element: CanvasElement): boolean {
    switch (element.type) {
      case 'sto':
        // Calculate the distance between the click coordinates (x, y) and the center of the table
        const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
        // Check if the distance is less than or equal to the radius of the table
        return distance <= element.radius;
      case 'kuhinja':
      case 'toalet':
        // Check if the click coordinates (x, y) are inside the boundaries of the rectangle
        return x >= element.x && x <= element.x + element.width &&
               y >= element.y && y <= element.y + element.height;
      default:
        return false;
    }
  }

  handleElementClick(element: CanvasElement): void {
    if (element.color === 'red') {
      // Prevent selecting red (reserved) tables
      return;
    }

    if (element.type === 'sto') {
      if (this.selectedTable === element) {
        // Deselect the table if already selected
        this.deselectTable(element);
      } else {
        // Deselect all tables first
        this.deselectAllTables();

        // Select the clicked table
        this.selectTable(element);
      }
    }
  }

  deselectAllTables(): void {
    for (const element of this.canvasElements) {
      if (element.type === 'sto' && element.color !== 'red') {
        element.color = 'white'; // Change color of all non-reserved tables back to white
      }
    }
    this.selectedTable = null;
    this.drawCanvasElements();
  }

  selectTable(table: CanvasElement): void {
    table.color = 'green'; // Change color to green
    this.selectedTable = table;
    this.drawCanvasElements();
  }

  deselectTable(table: CanvasElement): void {
    table.color = 'white'; // Change color back to white
    this.selectedTable = null;
    this.drawCanvasElements();
  }

  onDateTimeChange(): void {
    if (this.rezervacija2.date && this.rezervacija2.time && this.rezervacije) {
      this.updateTableColors(this.rezervacije);
    }
  }

  dohvRezervacije(): void{
    this.rezervacije = []
    this.servis.dohvRezervacije().subscribe(
      data => {
        for(let i = 0; i < data.length; i++){
          if(data[i].restoran == this.restoran.name){
            this.rezervacije.push(data[i])
          }
        }
      },
      error => {
        console.error('Greska pri dohvatanju rezervacija:', error);
      }
    )
  }

  updateTableColors(reservations: Rezervacija[]): void {
    const reservationTime = new Date(`${this.rezervacija2.date}T${this.rezervacija2.time}`);
    const endTime = new Date(reservationTime);
    endTime.setHours(endTime.getHours() + 3);

    for (const element of this.canvasElements) {
      if (element.type === 'sto') {
        const tableReservations = reservations.filter(res => res.tableNum === element.tableNumber);
        element.color = tableReservations.some(res => {
          const resTime = new Date(`${res.date}T${res.time}`);
          const resEndTime = new Date(resTime);
          resEndTime.setHours(resEndTime.getHours() + 3); //SREDITI DA NE PISE FIKSNO BROJ 3
          return resTime < endTime && resEndTime > reservationTime;
        }) ? 'red' : 'white';
      }
    }
    this.drawCanvasElements();
  }

  isWithinWorkingHours(dateTime: Date, workingHours: { start: string; end: string }): boolean {
    const startTime = new Date(dateTime.toDateString() + ' ' + workingHours.start)
    const endTime = new Date(dateTime.toDateString() + ' ' + workingHours.end)
    const dateTimePlusThreeHours = new Date(dateTime.getTime() + 3 * 60 * 60 * 1000)
    return dateTime >= startTime && dateTime <= endTime && dateTimePlusThreeHours <= endTime
  }

  getWorkingHours(day: string): string {
    const workingHours = this.restoran?.workingTime?.[day]
    return workingHours ? `${workingHours.start} - ${workingHours.end}` : 'Closed'
  }


  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>
  restoranName: string
  restoran: Restoran
  message: string = ""
  rezervacija: Rezervacija = new Rezervacija()
  selectedTable: CanvasElement
  canvasElements: CanvasElement[]
  rezervacija2: Rezervacija = new Rezervacija()
  rezervacije: Rezervacija[] = []
  user: User
  daysOfWeek: string[] = ['Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota', 'Nedelja']
}
