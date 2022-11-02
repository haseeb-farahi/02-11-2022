const { ObjectID } = require('bson')
var express = require('express')

var app = express()

app.listen(3000,()=>{
    console.log('Local Server is running on port 3000 ')
})
var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://localhost:27017"

app.get('/',(req,res)=>{
    res.send('<center><h1>We are on Home page<center/><h1/>')
})
//========================Deleting a Document
app.delete('/blog/:id',(req,res)=>{
    MongoClient.connect(url, (err,db)=>{
        if(err)throw err
        var dbo = db.db('StartupsDB')
        const myObjDel = {_id:ObjectID(req.params.id)}
        dbo.collection('Blog').deleteOne(myObjDel,(err, result)=>{
            if(err)throw err
            res.json(result)
            console.log('Document deleted!')
            db.close();
        })
    })
})
//=========================Update a Document==============================
app.patch('/blog/:id',(req,res)=>{
    MongoClient.connect(url, (err,db)=>{
        if(err)throw err
        var dbo = db.db('StartupsDB')
        var newVaule = req.body;
        // const myObjDel = {_id:ObjectID(req.params.id)}
        var newVaule = {
            author:"Jamshid"
        }
        dbo.collection('Blog').updateOne({_id: ObjectID(req.params.id)},{$set:newVaule},(err, result)=>{
            if(err)throw err
            res.json(result)
            // console.log('Document Updated!')
            db.close();
        })
    })    
})
// ========================Inserting A document===========================
app.post('/blog',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err)throw err
        var dbo = db.db('StartupsDB')
        const myObjQuery ={
            title:'this is from PostMan',
            body:'this is body of PostMan'
        };
    dbo.collection('Blog').insertOne(myObjQuery,(err,result)=>{
        if(err)throw err
        res.json(result)
        db.close();
    })    
    })
})
//======================Retriving Single Document=============================
app.get('/blog/:id',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err)throw err;
        var dbo = db.db('StartupsDB')
        var myObjQuery = {_id: ObjectID (req.params.id)}
        dbo.collection('Blog').findOne(myObjQuery,(err, result)=>{
            res.json(result)
            db.close()
        })
    })
    
})
//==============================Retriving Data by Array Method===================================
app.get('/blogs',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err)throw err;
        var dbo = db.db('StartupsDB')
        dbo.collection('Blog').find().toArray((err, result)=>{
            res.json(result)
            db.close()
        })
    })
})
//================================Retriving Data by FoerEach Method==============================
app.get('/bblogs',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err)throw err
        var dbo = db.db('StartupsDB')
        var posts =[]
        const page = req.query.p || 0
        const postPrePage = 3;

        dbo.collection('Blog').find().sort({title:-1}).skip(page* postPrePage).limit(postPrePage)
        .forEach((post)=>{
            posts.push(post)
        })
        .then(()=>{
            res.status(200).json(posts)
        })
        .catch(()=>{
            res.status(500).json({error:"Something went wrong on te server"})
        })
    })
})
