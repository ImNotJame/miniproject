const { error } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname,'..','data', 'movies.json');

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));


function readMovies(){
    try{
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }catch{
        return [];
    }
}

function writeMovies(movies){
    fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
}

app.get("/api/movies", (req, res) => {
    res.json(readMovies());
});

app.get("/api/movies/:id", (req, res) => {
    const movie = readMovies().find(m => m.id === parseInt(req.params.id));
    if(!movie){
        res.status(404).send("Movie not found");
    }else{
        res.json(movie);
    }
});

app.post("/api/movies", (req, res) => {
    const {title, year, rating, watchedOn, notes} = req.body;

    if (!title || !title.trim()){
        return res.status(400).json({error: "Title is required"});
        
    }
    if(!Number.isInteger(rating) || rating < 0 || rating > 5){
        return res.status(400).json({error: "Rating must be a number between 0 and 5"});
    }


    const movie ={
        id: Date.now().toString(),
        title: title.trim(),
        year: year || null,
        rating,
        watchedOn: watchedOn || null,
        notes: notes || "",
    };


    const movies = readMovies();
    movies.unshift(movie);
    writeMovies(movies);

    res.status(201).json(movie);



    
});


app.patch("/api/movies/:id", (req, res) => {
    const movies = readMovies();
    const movie = movies.find((m) => m.id === req.params.id);

    if(!movie){
        res.status(404).send("Movie not found");
    }

    const { rating} = req.body;
    if(rating !== undefined && !Number.isInteger(rating) || rating < 0 || rating > 5){
        return res.status(400).json({error: "Rating must be a number between 0 and 5"});
    }

    const allowed = ["title", "year", "rating", "watchedOn", "notes"];
    for (const key of allowed){
        if(req.body[key] !== undefined){
            movie[key] = req.body[key];
        }
    }

    writeMovies(movies);
    res.json(movie);
        
    
});

app.delete("/api/movies/:id", (req, res) => {
    const movies = readMovies();
    const remaining = movies.filter((m) => m.id !== req.params.id);

    if(movies.length === remaining.length){
        return res.status(404).json({error: "Movie not found"});
    }

    writeMovies(remaining);
    res.json({ok: true});
});




app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
