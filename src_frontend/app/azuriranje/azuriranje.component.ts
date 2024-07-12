import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AzuriranjeService } from '../services/azuriranje.service';

@Component({
  selector: 'app-azuriranje',
  templateUrl: './azuriranje.component.html',
  styleUrls: ['./azuriranje.component.css']
})
export class AzuriranjeComponent implements OnInit {
  constructor(private router: Router, private servis: AzuriranjeService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("User"))
  }

  async potvrdi(): Promise<void> {
    const formData = new FormData()
    if (this.selectedFile) {
      formData.append('file', this.selectedFile)
    }
    formData.append('username', this.user.username)
    formData.append('firstname', this.user.firstname)
    formData.append('lastname', this.user.lastname)
    formData.append('address', this.user.address)
    formData.append('phone', this.user.phone)
    formData.append('mail', this.user.mail)
    formData.append('credit_card', this.user.credit_card)

    this.servis.potvrdi(formData).subscribe(
      data => {
        this.user = data
        localStorage.setItem("User", JSON.stringify(this.user))
        this.user.image = 'http://localhost:4000/images/' + this.user.image
        alert("Uspesno azuriran profil")
      }
    )
  }


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.noChange = false
      this.selectedFile = event.target.files[0]

      const fileType = this.selectedFile.type
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        let reader = new FileReader()

        reader.onload = (e: any) => {
          let img = new Image()

          img.onload = () => {
            const width = img.width
            const height = img.height

            if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
              this.user.image = e.target.result
            } else {
              alert('Rezolucija slike mora biti izmedju 100x100px i 300x300px.')
              this.selectedFile = null;
              this.user.image = 'http://localhost:4000/images/default user.jpg'
            }
          }

          img.onerror = () => {
            alert('Nevalidna slika')
            this.selectedFile = null
            this.user.image = 'http://localhost:4000/images/default user.jpg'
          }

          img.src = e.target.result
        }

        reader.readAsDataURL(this.selectedFile)
      } else {
        alert('Izaberite JPG ili PNG format slike')
        this.selectedFile = null
        this.user.image = 'http://localhost:4000/images/default user.jpg'
      }
    } else {
      this.user.image = 'http://localhost:4000/images/default user.jpg'
    }
  }

  user: User
  selectedFile: File = null
  noChange: boolean = true
}
