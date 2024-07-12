import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AdministratorService } from '../services/administrator.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Restoran } from '../models/restoran';
import { Zahtev } from '../models/zahtev';
import { CanvasElement } from '../models/canvas';
import { Jelo } from '../models/jelo';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D
  selectedElement: 'sto' | 'toalet' | 'kuhinja' = 'sto'
  elements: CanvasElement[] = []
  memberCount: number = 1

  constructor(private servis: AdministratorService, private servisLogin: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.dohvKorisnike()
    this.dohvRestorane()
    this.dohvZahteve()
    this.noviRestoran.konobar = []
    this.noviRestoran.menu = []
    this.noviRestoran.grades = []
    this.noviRestoran.comments = []
    this.noviRestoran.workingTime = {
      'Ponedeljak': { start: '', end: '' },
      'Utorak': { start: '', end: '' },
      'Sreda': { start: '', end: '' },
      'Cetvrtak': { start: '', end: '' },
      'Petak': { start: '', end: '' },
      'Subota': { start: '', end: '' },
      'Nedelja': { start: '', end: '' }
    }
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')
    this.canvas.nativeElement.addEventListener('click', this.placeElement.bind(this))
  }

  placeElement(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Ensure the element stays within canvas bounds
    const canvasWidth = this.canvas.nativeElement.width
    const canvasHeight = this.canvas.nativeElement.height
    const elementSize = this.selectedElement === 'sto' ? 20 : 60

    if (
      x < elementSize || x > canvasWidth - elementSize ||
      y < elementSize || y > canvasHeight - elementSize
    ) {
      alert('Element must be placed within the canvas bounds.')
      return
    }

    const newElement: CanvasElement = {
      type: this.selectedElement,
      x,
      y,
      color: 'white',
      selected: false
    };

    if (this.selectedElement === 'sto') {
      newElement.radius = 20;
      newElement.members = this.memberCount;
      newElement.tableNumber = this.elements.filter(el => el.type === 'sto').length + 1
    } else {
      newElement.width = this.selectedElement === 'kuhinja' ? 100 : 80
      newElement.height = 60
    }

    if (!this.checkOverlap(newElement)) {
      this.elements.push(newElement)
      this.drawElements()
    } else {
      alert('Element overlaps with an existing one.')
    }
  }

  checkOverlap(newElement: CanvasElement): boolean {
    for (const element of this.elements) {
      if (newElement.type === 'sto' && element.type === 'sto') {
        const dx = element.x - newElement.x
        const dy = element.y - newElement.y
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (element.radius + newElement.radius)) {
          return true
        }
      } else {
        const newElementRight = newElement.x + (newElement.width || 0)
        const newElementBottom = newElement.y + (newElement.height || 0)
        const elementRight = element.x + (element.width || 0)
        const elementBottom = element.y + (element.height || 0)

        const overlapX = newElement.x < elementRight && newElementRight > element.x
        const overlapY = newElement.y < elementBottom && newElementBottom > element.y

        if (overlapX && overlapY) {
          return true
        }
      }
    }
    return false
  }

  drawElements(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    this.ctx.font = '16px Arial'

    for (const element of this.elements) {
      if (element.type === 'sto') {
        this.ctx.beginPath()
        this.ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI)
        this.ctx.fillStyle = element.color || 'blue'
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.fillStyle = 'black'
        this.ctx.fillText(`${element.members}`, element.x - 5, element.y + 5)
      } else {
        this.ctx.beginPath()
        this.ctx.rect(element.x, element.y, element.width, element.height)
        this.ctx.fillStyle = element.type === 'toalet' ? 'green' : 'red'
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.fillStyle = 'white'
        const text = element.type === 'toalet' ? 'Toalet' : 'Kuhinja'
        const textWidth = this.ctx.measureText(text).width
        const textX = element.x + (element.width - textWidth) / 2
        const textY = element.y + (element.height + 16) / 2
        this.ctx.fillText(text, textX, textY)
      }
    }
  }

  selectElement(type: 'sto' | 'toalet' | 'kuhinja'): void {
    this.selectedElement = type
  }

  saveCanvas(): void {
    if (this.validateCanvas()) {
      this.noviRestoran.canvas = this.elements
      const formData = new FormData()
      formData.append('canvas', JSON.stringify(this.elements))
      formData.append('konobar', JSON.stringify(this.noviRestoran.konobar))
      formData.append('address', this.noviRestoran.address)
      formData.append('name', this.noviRestoran.name)
      formData.append('type', this.noviRestoran.type)
      formData.append('phone', this.noviRestoran.phone)
      formData.append('description', this.noviRestoran.description)
      formData.append('comments', JSON.stringify(this.noviRestoran.comments))
      formData.append('grades', JSON.stringify(this.noviRestoran.grades))

      formData.append('workingTime', JSON.stringify(this.noviRestoran.workingTime))

      this.selectedFiles.forEach(file => {
        formData.append('jelo_image', file)
      })
      this.prices.forEach(price => {
        formData.append('jelo_price', price.toString())
      })
      this.names.forEach(name => {
        formData.append('jelo_name', name.toString())
      })
      for(let i = 0; i < this.ingredients.length; i++){
        formData.append('jelo_ingredient', JSON.stringify(this.ingredients[i]))
      }
      this.servis.saveCanvas(formData).subscribe(
        data => {
          alert(data.message);
          this.savedImageUrls = data.imageUrls
        },
        error => {
          console.error('Error saving canvas:', error)
        }
      );
    } else {
      alert('Canvas must have at least 1 kitchen, 1 toilet, and 3 tables.')
    }
  }


  validateCanvas(): boolean {
    if(this.canvasUpload == "file"){
      return true
    }
    const tableCount = this.elements.filter(el => el.type === 'sto').length
    const kitchenCount = this.elements.filter(el => el.type === 'kuhinja').length
    const toiletCount = this.elements.filter(el => el.type === 'toalet').length
    return tableCount >= 3 && kitchenCount >= 1 && toiletCount >= 1
  }

  dohvKorisnike(): void{
    this.konobari = []
    this.gosti = []
    this.servis.dohvKorisnike().subscribe(
      data =>{
        for(let i = 0; i < data.length; i++){
          if(data[i].type == "gost"){
            this.gosti.push(data[i])
          }
          else if(data[i].type == "konobar"){
            this.konobari.push(data[i])
          }
        }

      }
    )
  }

  dohvRestorane(): void{
    this.servisLogin.dohvRestorane().subscribe(
      data =>{
        this.restorani = data
      }
    )
  }

  dohvZahteve(): void{
    this.servis.dohvZahteve().subscribe(
      data =>{
        this.zahtevi = []
        for(let i = 0; i < data.length; i++){
          if(data[i].state == "na cekanju"){
            this.zahtevi.push(data[i])
          }
        }
      }
    )
  }

  azuriraj(u: User): void{
    localStorage.setItem("User", JSON.stringify(u))
    this.router.navigate(['azuriranje'])
  }

  deaktiviraj(u: User): void{
    this.servis.deaktiviraj(u).subscribe(
      data =>{
        alert(data.message)
      }
    )
  }

  odblokiraj(u: User): void{
    this.servis.odblokiraj(u).subscribe(
      data =>{
        u.blocked = false
      }
    )
  }

  prihvati(z: Zahtev): void{
    this.servis.prihvati(z).subscribe(
      data =>{
        alert(data.message)
        this.dohvZahteve()
      }
    )
  }

  odbi(z: Zahtev): void{
    this.servis.odbi(z).subscribe(
      data =>{
        alert(data.message)
      }
    )
  }

  dodajKonobara(): void{
    if(this.showForm == true){
      this.showForm = false
      return
    }
    this.noviKonobar = new User()
    this.showForm = true
  }

  dodaj(): void{
    if(this.regexPass(this.passKonobar) == false) {
      return
    }
    this.proveriRestoran()
  }

  proveriRestoran(): void {
    this.servis.proveriRestoran(this.noviKonobar.restaurant).subscribe(
      data => {
        if(data != null){
          console.log(data.name)
          if(this.musko == true) this.noviKonobar.gender = "musko"
          else if(this.zensko == true) this.noviKonobar.gender = "zensko"
          this.noviKonobar.type = "konobar"
          this.noviKonobar.password = this.servisLogin.hashPassword(this.passKonobar)
          this.servis.dodajKonobara(this.noviKonobar).subscribe(
            data => {
              this.showForm = false
              this.dohvKorisnike()
              this.passKonobar = ""
              this.restoranMessage = ""
            }
          )
        }
        else{
          this.restoranMessage = "Restoran sa datim imenom ne postoji"
        }
      }
    )
  }

  regexPass(pass: string): boolean{
    let atleast1Number: RegExp =  /^(?=.*\d)/
    let startingLetter = /^[a-zA-Z]/
    let min6Max10: RegExp = /^.{6,10}$/
    let atleast3LittleLetters = /^(?=(?:.*[a-z]){3})/
    let atleast1SpecChar = /^(?=.*[\W_])/
    let atleast1BigLetter: RegExp = /^(?=.*[A-Z])/

    if(min6Max10.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati izmedju 6 i 10 karaktera"
      return false
    }
    if(atleast1BigLetter.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedno veliko slovo"
      return false
    }
    if(atleast1Number.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedan broj"
      return false
    }
    if(atleast1SpecChar.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar jedan specijalni karakter"
      return false
    }
    if(atleast3LittleLetters.test(pass) == false){
      this.passMessage = "Lozinka mora sadrzati bar tri mala slova"
      return false
    }
    if(startingLetter.test(pass) == false){
      this.passMessage = "Lozinka mora poceti slovom"
      return false
    }
    this.passMessage = ""
    return true
  }

  dodajSastojak(): void{
    this.jelo.ingredients.push(this.sastojak)
    this.sastojak = ""
  }

  dodajJelo(): void {
    if (this.selectedFile) {
      this.noviRestoran.menu.push(this.jelo)
      this.names.push(this.jelo.name)
      this.prices.push(this.jelo.price)
      this.ingredients.push(this.jelo.ingredients)
      this.selectedFile = null; // Reset selected file for next jelo
      this.jelo = new Jelo()
    } else {
      alert('Please select an image for the Jelo.')
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFiles.push(this.selectedFile)

      // Check file type
      const fileType = this.selectedFile.type
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        let reader = new FileReader()

        reader.onload = (e: any) => {
          this.jelo.image = e.target.result
        }

        reader.onerror = () => {
          alert('Nevalidna slika')
          this.selectedFile = null
          this.jelo.image = 'http://localhost:4000/images/default user.jpg'
        };

        reader.readAsDataURL(this.selectedFile)
      } else {
        alert('Izaberite JPG ili PNG format slike')
        this.selectedFile = null
      }
    }
  }

  updateWorkingTime(day: string, start: string, end: string): void {
    this.noviRestoran.workingTime[day] = { start, end }
  }

  onFileUploadCanvas(event: any): void {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        if (jsonData.canvas && Array.isArray(jsonData.canvas)) {
          // Update canvas elements with the data from the JSON file
          this.elements = jsonData.canvas
          this.drawElements() // Redraw canvas with the new elements
        } else {
          throw new Error('Nevalidan JSON format')
        }
      } catch (error) {
        console.error('Greska prilikom prolaska kroz JSON file:', error)
        alert('Greska prilikom prolaska kroz JSON file. ' + error.message)
      }
    };
    reader.readAsText(file)
  }


  gosti: User[] = []
  konobari: User[] = []
  restorani: Restoran[] = []
  zahtevi: Zahtev[] = []
  noviRestoran: Restoran = new Restoran()
  jelo: Jelo = new Jelo()
  sastojak: string
  selectedFile: File = null
  selectedFiles: File[] = []
  names: String[] = []
  prices: number[] = []
  ingredients: string[][] = []
  savedImageUrls: string[] = []
  showForm: boolean = false
  noviKonobar: User
  musko: boolean
  zensko: boolean
  passMessage: string = ""
  passKonobar: string
  restoranMessage: string = ""
  canvasUpload: string = "draw"
}
