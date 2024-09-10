const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function(req, res) {
    fs.readdir("./hisaab", function(err, files) {
        if (err) return res.status(500).send(err);
        res.render("index", { files: files });
    });
});

app.post("/createhisaab", function(req, res) {
    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    
    // Read directory to count existing files with the same date prefix
    fs.readdir('./hisaab', function(err, files) {
        if (err) return res.status(500).send(err);
        
        
        
        const filename = `${req.body.title}-${date}.txt`; // Filename with date and counter
        fs.writeFile(`./hisaab/${filename}`, req.body.content, function(err) {
            if (err) return res.status(500).send(err);
            res.redirect("/");
        });
    });
});


app.get("/create",(req,res)=>{
    res.render("create");
});

app.get("/hisaab/:filename",function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("hisaab",{filedata,filename:req.params.filename})
    })
});

app.get("/delete/:filename",function(req,res){
    fs.unlink(`./hisaab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/")
    })
})
app.get("/edithisaab/:filename",function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("edit",{filedata,filename:req.params.filename})
    })
});
app.post("/update/:filename",function(req,res){
    console.log(req.params.filename);
    
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.filedata,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
});





app.get("/edit",(req,res)=>{
    res.render("edit");
});


// app.post("/edithisaab", function (req, res) {
//     fs.writeFile(`./hisaab/${req.body.title}.txt`, req.body.content, function (err) {
//         if (err) return res.status(500).send(err);
//         res.redirect("/edit");
//     });
// });


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
