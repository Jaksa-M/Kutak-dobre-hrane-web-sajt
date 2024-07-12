import express from 'express'
import UserM from '../models/User'
import ZahtevM from '../models/Zahtev'
import CanvasM from '../models/Canvas'
import RestoranM from '../models/Restoran'
import { Jelo } from '../models/Jelo'

export class AdminController{
    deaktiviraj = (req: express.Request, res: express.Response)=>{
        UserM.updateOne({username: req.body.username}, 
            {
                $set: {active: false}
            }).then(ok=>{
            res.json({message: "korisnik deaktiviran"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Fail"})
        })
    }

    odblokiraj = (req: express.Request, res: express.Response)=>{
        UserM.updateOne({username: req.body.username}, 
            {
                $set: {blocked: false}
            }).then(ok=>{
            res.json({message: "korisnik odblokiran"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Greska"})
        })
    }

    dohvZahteve = (req: express.Request, res: express.Response)=>{
        ZahtevM.find({}).then(zahtevi=>{
            res.json(zahtevi)
        }).catch((err)=>{
            console.log(err)
        })
    }

    prihvati = (req: express.Request, res: express.Response)=>{
        let user = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            address: req.body.address,
            type: "gost",
            phone: req.body.phone,
            mail: req.body.mail,
            credit_card: req.body.credit_card,
            question: req.body.question,
            answer: req.body.answer,
            active: true,
            image: req.body.image,
            not_showed: 0,
            blocked: false
        }

        new UserM(user).save().then(ok => {
            // If user is saved successfully, delete the request
            return ZahtevM.deleteOne({ username: req.body.username })
        }).then(deletionRes => {
            // Check if the request was deleted
            if (deletionRes.deletedCount === 1) {
                res.json({ message: "uspesno prihvacen zahtev" })
            } else {
                res.json({ message: "greska" })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    odbi = (req: express.Request, res: express.Response)=>{
        ZahtevM.updateOne({username: req.body.username}, 
            {
                $set: {state: "odbijen"}
            }).then(ok=>{
            res.json({message: "zahtev odbijen"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Fail"})
        })
    }

    dodajKonobara = (req: express.Request, res: express.Response)=>{
        let user = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            address: req.body.address,
            type: "konobar",
            phone: req.body.phone,
            mail: req.body.mail,
            credit_card: req.body.credit_card,
            question: req.body.question,
            answer: req.body.answer,
            image: req.body.image,
            restaurant: req.body.restaurant
        }

        new UserM(user).save().then(ok => {
            RestoranM.findOneAndUpdate(
                { name: req.body.restaurant },
                { $push: { konobar: user.username } },
                { new: true } // Ensures the updated document is returned
            ).then(updatedRestoran => {
                if (updatedRestoran) {
                    res.json({ message: "Uspesno dodat konobar" })
                } else {
                    res.status(404).json({ message: "Restoran nije pronađen" })
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ message: "Greška prilikom ažuriranja restorana" })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Greška prilikom dodavanja konobara" })
        })
    }

    proveriRestoran = (req: express.Request, res: express.Response)=>{
        RestoranM.findOne({name: req.body.name}).then(restoran=>{
            res.json(restoran)
        }).catch((err)=>{
            console.log(err)
        })
    }

    // saveCanvas(req: express.Request, res: express.Response): void {
    //     const restoranData = req.body
        
    //     const restoran = new RestoranM(restoranData)
        
    //     restoran.save().then(() => {
    //         res.json({ message: 'Restoran with canvas saved successfully' })
    //       })
    //       .catch((error: any) => {
    //         console.error('Error saving restoran with canvas:', error);
    //         res.status(500).json({ message: 'Failed to save restoran with canvas' })
    //       });
    // }

    saveCanvas(req: express.Request, res: express.Response) {
        try{
            const imageFiles = req.files as Express.Multer.File[];
            
            const rest = new RestoranM();
            
            rest.menu = rest.menu || [];
            if (!imageFiles) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            
            for(let i = 0; i < Number(imageFiles.length); i++){
                const ingredientsString = req.body.jelo_ingredient[i];
                const ing: string[] = JSON.parse(ingredientsString);
                const jelo = rest.menu.create({
                    name: req.body.jelo_name[i],
                    image: imageFiles[i].originalname,
                    price: parseInt(req.body.jelo_price[i]),
                    ingredients: ing
                });
                rest.menu.push(jelo);
            }

            // Create a new Restoran object with the extracted data
            const restoran = {
                konobar: JSON.parse(req.body.konobar),
                kitchenTime: req.body.kitchenTime,
                address: req.body.address,
                name: req.body.name,
                type: req.body.type,
                phone: req.body.phone,
                description: req.body.description,
                comments: JSON.parse(req.body.comments),
                grades: JSON.parse(req.body.grades),
                canvas: JSON.parse(req.body.canvas),
                menu: rest.menu,
                workingTime: JSON.parse(req.body.workingTime)
            };

            new RestoranM(restoran).save().then(() => {
                res.json({ message: 'Restoran with canvas saved successfully' })
            })
            .catch((error: any) => {
            console.error('Error saving restoran with canvas:', error);
            res.status(500).json({ message: 'Failed to save restoran with canvas' })
            });
    }catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ message: 'Invalid JSON input' });
    }
    }
}
