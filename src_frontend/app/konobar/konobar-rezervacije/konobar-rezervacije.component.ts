import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasElement } from 'src/app/models/canvas';
import { Restoran } from 'src/app/models/restoran';
import { Rezervacija } from 'src/app/models/rezervacija';
import { User } from 'src/app/models/user';
import { KonobarService } from 'src/app/services/konobar.service';


@Component({
  selector: 'app-konobar-rezervacije',
  templateUrl: './konobar-rezervacije.component.html',
  styleUrls: ['./konobar-rezervacije.component.css']
})
export class KonobarRezervacijeComponent {
  constructor(private router: Router, private servis: KonobarService){}
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("User"))
      this.dohvRestoran()
      this.selectedTable = null
  }

  azuriraj(): void{
    this.router.navigate(['azuriranje']);
  }

  dohvRestoran(): void{
    this.servis.dohvRestoran(this.user.username).subscribe(
      data => {
        this.restoran = data
        this.dohvRezervacije()
        this.loadCanvas()
      }
    )
  }

  dohvRezervacije(): void{
    this.rezervacije = []
    this.potvrdjeneRezervacije = []
    this.servis.dohvRezervacije().subscribe(
      data => {
        const currentTime = new Date()
        for(let i = 0; i < data.length; i++){
          const rezDateTime = new Date(`${data[i].date}T${data[i].time}`)
          if(data[i].restoran == this.restoran.name && data[i].state == "neobradjena"){
            if(currentTime > rezDateTime){
              data[i].state = "nije se pojavio"
              this.servis.sePojavio(data[i]).subscribe(
                data => {}
              )
            }
            else{
              this.rezervacije.push(data[i])
            }
          }
          else if(data[i].restoran == this.restoran.name && data[i].state == "potvrdjena" && data[i].konobar == this.user.username){
            this.potvrdjeneRezervacije.push(data[i])
            this.istekloPolaH.push(false)
            this.pojavioSe.push("")
            const rezEndTime = new Date(rezDateTime.getTime() + data[i].reservationTime * 60 * 60 * 1000);
            if(currentTime >= rezDateTime && currentTime <= rezEndTime && data[i].reservationTime == 3){
              this.moguceProduziti.push(true)
            }
            else{
              this.moguceProduziti.push(false)
            }
          }
          else if(data[i].restoran == this.restoran.name && data[i].state == "pojavio se"){
            this.pojavljeneRezervacije.push(data[i])
          }
        }
        this.rezervacije.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        this.potvrdjeneRezervacije.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        this.potvrdiPojavu()
      }
    )
  }

  potvrdiPojavu(): void{
    const currentTime = new Date();
    for (let i = 0; i < this.potvrdjeneRezervacije.length; i++) {
      const reservacijaTime = new Date(`${this.potvrdjeneRezervacije[i].date}T${this.potvrdjeneRezervacije[i].time}`);
      const reservacijaTimePlus30Minutes = new Date(reservacijaTime.getTime() + 30 * 60000); // Adding 30 minutes in milliseconds

      if (currentTime >= reservacijaTimePlus30Minutes) {
        this.istekloPolaH[i] = true;
      } else {
        this.istekloPolaH[i] = false;
      }
    }
  }

  potvrdi(rez: Rezervacija): void{
    if(rez.tableNum == -1 && this.selectedTable == null){
      alert("Niste odabrali sto")
      return
    }
    rez.state = "potvrdjena"
    rez.konobar = this.user.username
    if(rez.tableNum == -1) rez.tableNum = this.selectedTable.tableNumber
    this.servis.potvrdi(rez).subscribe(
      data => {
        this.updateTableColor(rez.tableNum, 'red')
        this.dohvRezervacije()
      }
    )
  }

  odbi(rez: Rezervacija): void{
    rez.state = "odbijena"
    this.updateTableColor(rez.tableNum, 'white')
    this.servis.odbi(rez).subscribe(
      data => {
        this.dohvRezervacije()
      }
    )
  }

  prikazi(rez: Rezervacija): void{
    this.resetTableColors()
    if(rez.tableNum != -1){ //When rezervacija is filled throughout the canvas
      this.highlightReservationTable(rez.tableNum)
    }
    else { //When rezervacija is filled thorught the form
      const rezStartTime = new Date(`${rez.date}T${rez.time}`).getTime()
      const rezEndTime = rezStartTime + rez.reservationTime * 60 * 60 * 1000 //Time in milliseconds

      for (const potvrdjenaRez of this.potvrdjeneRezervacije) {
        const potvrdjeneRezStartTime = new Date(`${potvrdjenaRez.date}T${potvrdjenaRez.time}`).getTime()
        const potvrdjeneRezEndTime = potvrdjeneRezStartTime + potvrdjenaRez.reservationTime * 60 * 60 * 1000

        // Check if the potvrdjena rezervacija time overlaps with the given rezervacija time
        if ((rezStartTime <= potvrdjeneRezEndTime) && (potvrdjeneRezStartTime <= rezEndTime)) {
          this.updateTableColor(potvrdjenaRez.tableNum, 'red')
        }
      }

      for (const pojavljenaRez of this.pojavljeneRezervacije) {
        const pojavljeneRezStartTime = new Date(`${pojavljenaRez.date}T${pojavljenaRez.time}`).getTime()
        const pojavljeneRezEndTime = pojavljeneRezStartTime + pojavljenaRez.reservationTime * 60 * 60 * 1000

        if ((rezStartTime <= pojavljeneRezEndTime) && (pojavljeneRezStartTime <= rezEndTime)) {
          this.updateTableColor(pojavljenaRez.tableNum, 'red')
        }
      }

      //All the tables that don't have enough space to fit rezervacija.people should be colored red
      for (const element of this.canvasElements) {
        if (element.type === 'sto' && element.members < rez.people) {
          this.updateTableColor(element.tableNumber, 'red')
        }
      }
      this.dohvRezervacije()
    }
  }

  sePojavio(rez: Rezervacija, index: number): void{
    rez.state = this.pojavioSe[index] == "nije" ? "nije se pojavio" : "pojavio se"
    this.servis.sePojavio(rez).subscribe(
      data => {
        this.dohvRezervacije()
      }
    );
  }

  produzi(rez: Rezervacija, index: number): void{
    rez.reservationTime += 1
    if(this.moguceProduziti[index] == true){
      this.moguceProduziti[index] = false
      rez.reservationTime = 4
      this.servis.produzi(rez).subscribe(
        data =>{}
      )
    }

  }


  //EVERYTHING WITH CANVAS:
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

  // updateCanvasInDatabase(): void {
  //   // Send the updated canvas (with reserved tables marked as red) to the server to update the database
  //   this.servis.updateCanvas(this.restoran).subscribe(
  //     data => {
  //       alert(data.message);
  //     },
  //     error => {
  //       console.error('Error updating canvas:', error);
  //     }
  //   );
  // }

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
    if (element.color == 'red') {
      return;
    }

    if (element.type == 'sto') {
      if (this.selectedTable == element) {
        this.deselectTable(element)
      } else {
        this.deselectAllTables()
        this.selectTable(element)
      }
    }
  }

  deselectAllTables(): void {
    for (const element of this.canvasElements) {
      if (element.type === 'sto' && element.color !== 'red') {
        element.color = 'white'
      }
    }
    this.selectedTable = null
    this.drawCanvasElements()
  }

  selectTable(table: CanvasElement): void {
    table.color = 'green'
    this.selectedTable = table
    this.drawCanvasElements()
  }

  deselectTable(table: CanvasElement): void {
    table.color = 'white'
    this.selectedTable = null
    this.drawCanvasElements()
  }

  highlightReservationTable(tableNum: number): void {
    for (const element of this.canvasElements) {
      if (element.type === 'sto' && element.tableNumber === tableNum) {
        element.color = 'yellow'
      } else if (element.type === 'sto' && element.color !== 'red') {
        element.color = 'white'
      }
    }
    this.drawCanvasElements();
  }

  updateTableColor(tableNum: number, color: string): void {
    for (const element of this.canvasElements) {
      if (element.type === 'sto' && element.tableNumber === tableNum) {
        element.color = color
      }
    }
    this.drawCanvasElements()
  }

  resetTableColors(): void {
    for (const element of this.canvasElements) {
      if (element.type === 'sto') {
        element.color = 'white'
      }
    }
    this.drawCanvasElements()
  }

  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  user: User
  restoran: Restoran
  rezervacije: Rezervacija[] = []
  potvrdjeneRezervacije: Rezervacija[] = []
  moguceProduziti: boolean[] = []
  pojavljeneRezervacije: Rezervacija[] = []
  istekloPolaH: boolean[] = []
  selectedTable: CanvasElement
  canvasElements: CanvasElement[]
  pojavioSe: string[] = []
}
