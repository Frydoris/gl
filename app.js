var express = require('express');
 bodyParser = require('body-parser');
 mongoose = require('mongoose');
 port = process.env.PORT || 3000
 app = express();

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 mongoose.connect('mongodb://localhost/mesLivres',{ useNewUrlParser: true, useUnifiedTopology: true });

var mesLivreSchema = mongoose.Schema({
    titre : String,
    description : String,
    auteur: String,
    anneeParution: Number
});

var Livre = mongoose.model('Livre', mesLivreSchema);

var router = express.Router();

router.route('/')
    .get((req, res)=>{
        Livre.find((err, mesLivres)=>{
            if(err)res.send(err);
            res.send(mesLivres);
        });
        console.log("Livres trouvés")
    })

    .post((req, res)=>{
        var livre = new Livre();
        livre.titre = req.body.titre;
        livre.description = req.body.description;
        livre.auteur = req.body.auteur;
        livre.anneeParution = req.body.anneeParution
        livre.save((err)=>{  // la methode findOneAndUpdate est plus appropriées
            if(err)res.send(err)
            res.send({message:'Livre créé'})
        })
    })

    router.route('/:livre_id')
        .get((req, res)=>{
            Livre.findOne({_id:req.params.livre_id}, (err, livre)=>{
                if(err)res.send(err)
                res.send(livre)
            })
        })

        .put((req, res)=>{
            Livre.findOne({_id:req.params.livre_id}, (err, livre)=>{
                livre.titre = req.body.titre;
                livre.description = req.body.description;
                livre.auteur = req.body.auteur;
                livre.anneeParution = req.body.anneeParution
                livre.save((err)=>{
                    if(err) res.send(err)
                    res.send({message: 'Mise à jour éffectuée'})
                })
            })

        })

        .delete((req, res)=>{
            Livre.remove({_id:req.params.livre_id},(err)=>{
                if(err)res.send(err)
                res.send({message: 'Livre supprimé'})
            })
        })

    app.use('/api', router)


app.listen(port,()=>{
    console.log('Lancé sur le port '+port);
})