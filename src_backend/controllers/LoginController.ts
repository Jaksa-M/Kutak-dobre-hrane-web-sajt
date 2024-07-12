import express from 'express'
import UserM from '../models/User'
import ZahtevM from '../models/Zahtev'
import RestoranM from '../models/Restoran'
import RezervacijaM from '../models/Rezervacija'

export class LoginController{
    login = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username
        let passwordP = req.body.password

        UserM.findOne({username: usernameP, 
        password: passwordP}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        }) 
    }
    
    register = (req: express.Request, res: express.Response) => {
        const imageFile = req.file; // Use req.file for single file uploads

        if (!imageFile) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        let zahtev = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            mail: req.body.mail,
            credit_card: req.body.credit_card,
            question: req.body.question,
            answer: req.body.answer,
            state: "na cekanju",
            image: imageFile.originalname
        }

        new ZahtevM(zahtev).save().then(ok => {
            return res.json({ message: "ok" })
        }).catch(err => {
            console.log("Error saving user:", err);
            return res.status(500).json({ message: "Error registering user" })
        })
    }
    

    dohvRestorane = (req: express.Request, res: express.Response)=>{
        RestoranM.find({}).then(restorani=>{
            res.json(restorani)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvKonobara = (req: express.Request, res: express.Response)=>{
        UserM.findOne({username: req.body.username}).then(user=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvGoste = (req: express.Request, res: express.Response)=>{
        UserM.find({}).then(gosti=>{
            res.json(gosti)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvRezervacije = (req: express.Request, res: express.Response)=>{
        RezervacijaM.find({}).then(rezervacije=>{
            res.json(rezervacije)
        }).catch((err)=>{
            console.log(err)
        })
    }

    potvrdi = async(req: express.Request, res: express.Response) => {
        const imageFile = req.file;

        let updateFields: {
            firstname: string;
            lastname: string;
            address: string;
            phone: string;
            mail: string;
            credit_card: string;
            image?: string; // Optional image field
        } = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            phone: req.body.phone,
            mail: req.body.mail,
            credit_card: req.body.credit_card
        };

        if (imageFile) {
            updateFields.image = imageFile.originalname;
        }
        else {
            try {
                const user = await UserM.findOne({ username: req.body.username });
                if (user && user.image) {
                    updateFields.image = user.image; // Keep the old image
                }
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Error retrieving existing user image" });
            }
        }

        UserM.updateOne(
            { username: req.body.username },
            { $set: updateFields }
        )
        .then(() => {
            // After updating the user, find and return the updated user
            UserM.findOne({ username: req.body.username }).then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Error retrieving updated user" });
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error updating user" });
        });
    };

    promeniLozinku = (req: express.Request, res: express.Response)=>{
        UserM.updateOne({username: req.body.username, password: req.body.password}, 
            {
                $set: {
                    password: req.body.newPass
                }
            }).then(result => {
                if (result.matchedCount === 0) {
                    res.status(404).json({ message: "Korisnik sa tim korisnickim imenom nije pronadjen ili je sifra netacna" })
                } else {
                    res.json({ message: "uspesno promenjena lozinka" })
                }
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Fail"})
        })
    }

    getUser = (req: express.Request, res: express.Response)=>{
        UserM.findOne({username: req.body.username}).then(user=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dalje = (req: express.Request, res: express.Response)=>{
        UserM.findOne({username: req.body.username, password: req.body.password}).then(user=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvKorisnike = (req: express.Request, res: express.Response)=>{
        UserM.find({}).then(korisnici=>{
            res.json(korisnici)
        }).catch((err)=>{
            console.log(err)
        })
    }

    checkUsername = async (req: express.Request, res: express.Response) => {
        try {
            const user = await UserM.findOne({ username: req.body.username })
            if (user) {
                return res.json(false);
            }
    
            const zahtev = await ZahtevM.findOne({ username: req.body.username })
            if (zahtev) {
                return res.json(false)
            }
    
            return res.json(true)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" })
        }
    }
    

    checkMail = async (req: express.Request, res: express.Response) => {
        try {
            const user = await UserM.findOne({ mail: req.body.mail })
            if (user) {
                return res.json(false)
            }
    
            const zahtev = await ZahtevM.findOne({ mail: req.body.mail })
            if (zahtev) {
                return res.json(false)
            }
    
            return res.json(true)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Server error" })
        }
    }
    
}
