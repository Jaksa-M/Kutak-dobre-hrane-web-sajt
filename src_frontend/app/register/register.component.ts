import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  constructor(private servis: LoginService){}

  ngOnInit(): void {
    this.user.image = 'http://localhost:4000/images/default user.jpg';
    this.setDefaultUserImage();
  }

  private setDefaultUserImage() {
    fetch('http://localhost:4000/images/default user.jpg')
      .then(response => response.blob())
      .then(blob => {
        // Create a File object from the blob
        const file = new File([blob], 'default_user.jpg', { type: 'image/jpeg' });
        this.selectedFile = file;
      })
      .catch(error => console.error('Error fetching default user image:', error));
  }

  async register(){
    //const passwordRegex = /^(?=[A-Za-z])(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]{6,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^06\d{7,8}$/
    const creditCardRegex = /^\d{4} \d{4} \d{4} \d{4}$/
    let validation: boolean
    if(this.regexPass(this.password) == false) {
      return
    }
    validation = emailRegex.test(this.user.mail)
    if (validation == false) {
      alert("mail adresa nije validna")
      return
    }
    validation = phoneRegex.test(this.user.phone)
    if (validation == false) {
      alert("broj telefona nije validan")
      return
    }
    validation = creditCardRegex.test(this.user.credit_card)
    if (validation == false) {
      alert("nevalidan broj kreditne kartice")
      return
    }
    await this.checkUsername();
    if(this.usernameCheck == false){
      alert("korisnicko ime vec postoji")
      return
    }
    await this.checkMail();
    if(this.mailCheck == false){
      alert("mail vec postoji")
      return
    }

    this.user.type = "gost"
    this.user.not_showed = 0
    this.user.blocked = false
    this.user.password = this.servis.hashPassword(this.password)

    const formData = new FormData()
    formData.append('username', this.user.username)
    formData.append('password', this.user.password)
    formData.append('firstname', this.user.firstname)
    formData.append('lastname', this.user.lastname)
    formData.append('gender', this.user.gender)
    formData.append('address', this.user.address)
    formData.append('type', this.user.type)
    formData.append('phone', this.user.phone)
    formData.append('mail', this.user.mail)
    formData.append('credit_card', this.user.credit_card)
    formData.append('question', this.user.question)
    formData.append('answer', this.user.answer)
    if (this.selectedFile != null) {
      formData.append('file', this.selectedFile)
      console.log(this.selectedFile)
    } else {
      formData.append('file', '')
    }

    this.servis.register(formData).subscribe(
      data=>{
        if(data.message=="ok") alert("Dodato")
      }
    )
  }

  async checkUsername(): Promise<void> {
    const data = await firstValueFrom(this.servis.checkUsername(this.user.username))
    this.usernameCheck = data
  }

  async checkMail(): Promise<void> {
    const data = await firstValueFrom(this.servis.checkMail(this.user.mail))
    this.mailCheck = data
  }

  regexPass(pass: string): boolean{
    let atleast1BigLetter: RegExp = /^(?=.*[A-Z])/
    let min6Max10: RegExp = /^.{6,10}$/
    let atleast1Number: RegExp =  /^(?=.*\d)/
    let atleast3LittleLetters = /^(?=(?:.*[a-z]){3})/
    let atleast1SpecChar = /^(?=.*[\W_])/
    let startingLetter = /^[a-zA-Z]/

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

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Check file type
      const fileType = this.selectedFile.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        // Create a FileReader object
        let reader = new FileReader();

        // Define a function to be executed when the file is successfully read
        reader.onload = (e: any) => {
          // Create an Image object
          let img = new Image();

          img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
              // Update the user.image with the data URL of the selected file
              this.user.image = e.target.result;
            } else {
              alert('Rezolucija slike mora biti izmedju 100x100px i 300x300px.');
              this.selectedFile = null;
              this.user.image = 'http://localhost:4000/images/default user.jpg';
            }
          };

          img.onerror = () => {
            alert('Nevalidna slika');
            this.selectedFile = null;
            this.user.image = 'http://localhost:4000/images/default user.jpg';
          };

          // Set the src of the Image object to the result of FileReader
          img.src = e.target.result;
        };

        // Read the file as a data URL
        reader.readAsDataURL(this.selectedFile);
      } else {
        alert('Izaberite JPG ili PNG format slike');
        this.selectedFile = null;
        this.user.image = 'http://localhost:4000/images/default user.jpg';
      }
    } else {
      // If no file is selected, assign the path to the default picture
      this.user.image = 'http://localhost:4000/images/default user.jpg'; // Adjust the path accordingly
    }
  }

  @ViewChild('singleInput', {static: false}) singleInput: ElementRef

  user: User = new User()
  musko: boolean
  zensko: boolean
  usernameCheck: boolean
  mailCheck: boolean
  selectedFile: File = null
  passMessage: string = ""
  password: string
}
