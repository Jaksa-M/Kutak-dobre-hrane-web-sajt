import express from 'express'
import RestoranM from '../models/Restoran'
import RezervacijaM from '../models/Rezervacija'
import UserM from '../models/User'
import NarudzbinaM from '../models/Narudzbina'
import mongoose from 'mongoose'

export class RestoranController{
    restoranInfo = (req: express.Request, res: express.Response)=>{
        let restoranName = req.body.name;
        RestoranM.findOne({name: restoranName}).then(restoran=>{
            res.json(restoran)
        }).catch((err)=>{
            console.log(err)
        })
    }

    rezervisi = (req: express.Request, res: express.Response)=>{
        let rezervacija = {
            restoran: req.body.restoran,
            request: req.body.request,
            time: req.body.time,
            date: req.body.date,
            people: req.body.people,
            grade: req.body.grade,
            comment: req.body.comment,
            tableNum: req.body.tableNum,
            state: req.body.state,
            reservationTime: req.body.reservationTime,
            rejectedComment: req.body.rejectedComment,
            user: req.body.user,
            konobar: req.body.konobar,
            menu: req.body.menu, //NZM STO SAM OVO STAVIO
        }

        new RezervacijaM(rezervacija).save().then(ok=>{
            res.json({message: "rezervacija potvrdjena"})
        }).catch(err=>{
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

    dohvSvojeRezervacije = (req: express.Request, res: express.Response)=>{
        RezervacijaM.find({user: req.body.username}).then(rezervacije=>{
            res.json(rezervacije)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvRezervacijeKonobar = (req: express.Request, res: express.Response)=>{
        RezervacijaM.find({konobar: req.body.username, state: "pojavio se"}).then(rezervacije=>{
            res.json(rezervacije)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvRezervacijeRestoran = (req: express.Request, res: express.Response)=>{
        RezervacijaM.find({restoran: req.body.name, state: "pojavio se"}).then(rezervacije=>{
            res.json(rezervacije)
        }).catch((err)=>{
            console.log(err)
        })
    }

    otkazi = (req: express.Request, res: express.Response)=>{
        RezervacijaM.deleteOne({restoran: req.body.restoran, request: req.body.request, date: req.body.date, time: req.body.time,
            people: req.body.people, grade: req.body.grade, comment: req.body.comment}).then(result=>{
            res.json({message: "rezervacija otkazana"})
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvAdresu = (req: express.Request, res: express.Response)=>{
        RestoranM.findOne({name: req.body.name}).then(restoran=>{
            res.json({ message: restoran?.address })
        }).catch((err)=>{
            console.log(err)
        })
    }

    oceni = (req: express.Request, res: express.Response)=>{
        RezervacijaM.updateOne({restoran: req.body.restoran, user: req.body.user, date: req.body.date, time: req.body.time}, 
            {
                $set: {
                    grade: req.body.grade,
                    comment: req.body.comment
                }
            }).then(result => {
                RestoranM.findOne({ name: req.body.restoran }).then(restoran => {
                    if (!restoran) {
                        return res.json({ message: "Restoran nije pronadjen" });
                    }
                    restoran.comments.push(req.body.comment);
                    restoran.save().then(() => {
                        res.json({ message: "Restoran ocenjen" });
                    }).catch(err => {
                        console.log(err);
                        res.json({ message: "Greska pri cuvanju komentara" });
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({ message: "Greska pri pronalazenju restorana" });
                });
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Greska"})
        })
    }

    dohvRestoran = (req: express.Request, res: express.Response)=>{
        RestoranM.findOne({konobar: req.body.username}).then(restoran=>{
            res.json(restoran)
        }).catch((err)=>{
            console.log(err)
        })
    }

    potvrdi = (req: express.Request, res: express.Response)=>{
        RezervacijaM.updateOne({restoran: req.body.restoran, time: req.body.time, date: req.body.date}, 
            {
                $set: {
                    state: "potvrdjena",
                    konobar: req.body.konobar,
                    tableNum: req.body.tableNum
                }
            }).then(result => {
                res.json({ message: "rezervacija potvrdjena" })
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Greska"})
        })
    }

    odbi = (req: express.Request, res: express.Response)=>{
        RezervacijaM.updateOne({restoran: req.body.restoran, time: req.body.time, date: req.body.date}, 
            {
                $set: {
                    state: "odbijena",
                    rejectedComment: req.body.rejectedComment
                }
            }).then(result => {
                res.json({ message: "rezervacija odbijena" })
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Greska"})
        })
    }

    sePojavio = (req: express.Request, res: express.Response) => {
        UserM.findOne({ username: req.body.user })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: "Korisnik nije pronadjen" });
                }
                
                // Ensure not_showed has a default value of 0 if it is null or undefined, had to write this in order not to get red underline error
                const currentNotShowedCount = user.not_showed ?? 0;
                let newNotShowedCount = currentNotShowedCount;
                if (req.body.state == "nije se pojavio") {
                    newNotShowedCount++;
                }
    
                UserM.updateOne(
                    { username: req.body.user },
                    {
                        $set: {
                            not_showed: newNotShowedCount,
                            active: newNotShowedCount == 3 ? false : user.active,
                        }
                    }
                )
                .then(() => {
                    return RezervacijaM.updateOne(
                        {user: req.body.user, time: req.body.time, date: req.body.date, restoran: req.body.restoran},
                        {$set: {state: req.body.state}}
                    );
                })
                .then(() => {
                    if (req.body.state == "nije se pojavio") {
                        res.json({
                            message: newNotShowedCount == 3 ? "Korisnik se nije pojavio 3 puta na rezervaciju, pa je blokiran" : 
                                "Korisniku se povecao broj nepojavljivanja"
                        });
                    } else {
                        res.json({ message: "Korisnik se pojavio" });
                    }
                })
                .catch(err => {console.log(err)});
            })
            .catch(err => {console.log(err)});
    };

    produzi = (req: express.Request, res: express.Response) => {
        RezervacijaM.updateOne({user: req.body.user, restoran: req.body.restoran, date: req.body.date, time: req.body.time, people: req.body.people},
            {
                $set: {
                    reservationTime: req.body.reservationTime
                }
            }
        ).then(ok=>{
            res.json({message: "rezervacija produzena"})
        }).catch((err)=>{
            console.log(err)
        })
    };
    

    zavrsiNarudzbinu = (req: express.Request, res: express.Response)=>{
        let narudzbina = {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            korpa: req.body.korpa,
            status: req.body.status,
            expectedTime: req.body.expectedTime,
            restoran: req.body.restoran,
            date: req.body.date,
            total_price: req.body.total_price
        }

        new NarudzbinaM(narudzbina).save().then(ok=>{
            res.json({message: "narudzbina poslata"})
        }).catch(err=>{
            console.log(err)
        })
    }

    dohvNarudzbine = (req: express.Request, res: express.Response)=>{
        NarudzbinaM.find({}).then(narudzbine=>{
            res.json(narudzbine)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvNarudzbineGost = (req: express.Request, res: express.Response)=>{
        NarudzbinaM.find({name: req.body.username}).then(narudzbine=>{
            res.json(narudzbine)
        }).catch((err)=>{
            console.log(err)
        })
    }

    potvrdiNarudzbinu = (req: express.Request, res: express.Response)=>{
        NarudzbinaM.updateOne({_id: req.body._id},
            {
                $set: {
                    status: req.body.status,
                    expectedTime: req.body.expectedTime,
                    date: req.body.date
                }
            }
        ).then(ok=>{
            res.json({message: "narudzbina potvrdjena"})
        }).catch((err)=>{
            console.log(err)
        })
    }

    odbijNarudzbinu = (req: express.Request, res: express.Response)=>{
        NarudzbinaM.updateOne({_id: req.body._id},
            {
                $set: {
                    status: req.body.status
                }
            }
        ).then(ok=>{
            res.json({message: "narudzbina odbijena"})
        }).catch((err)=>{
            console.log(err)
        })
    }

    updateCanvas = (req: express.Request, res: express.Response)=>{
        RestoranM.updateOne({name: req.body.name},
            {
                $set: {
                    canvas: req.body.canvas
                }
            }
        ).then(ok=>{
            res.json({message: "uspesno azuriran canvas"})
        }).catch((err)=>{
            console.log(err)
        })
    }
}