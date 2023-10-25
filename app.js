// import fs from './fs';
// import express from './express';
// import bodyParser from './body-parser';
// import * as url from './url';
const { time } = require('console');
const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf-8');
const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


// let dictionaryData = JSON.parse(fs.readFileSync('recipe-dictionary.json', 'utf-8'));
let recipeHTML = fs.readFileSync('recipe-shell.html', 'utf-8');
var recipeName = ""
let recipeData = JSON.parse(fs.readFileSync("./allrecipes/AirFryerSpicyOnionRings.json", 'utf-8'));

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static(__dirname + '/public'));

app.get("/", function(request, response){
    let recipeHTMLArray = recipeData.map((recipe) => {
        let output = recipeHTML.replace('{{%TITLE%}}', recipe.name);
    
        const timeNumbers = [];
        const timeUnits = [];
        timeNumbers.push(recipe.prepTime, recipe.cookTime, recipe.totalTime)
        timeUnits.push("Minutes", "Minutes", "Minutes")
    
        for(let i = 0; i < timeNumbers.length; i++) {
            timeNumbers[i] = timeNumbers[i].match(/\d/g);
            timeNumbers[i] = timeNumbers[i].join("");
            if(timeNumbers[i] >= 60) {
                timeNumbers[i] = timeNumbers[i]/60;
                timeUnits[i] = "Hours"
            }
        }
    
        output = output.replace('{{%PREPTIME%}}', timeNumbers[0]).replace('{{%PTUNIT%}}', timeUnits[0]);
        output = output.replace('{{%COOKTIME%}}', timeNumbers[1]).replace('{{%CTUNIT%}}', timeUnits[1]);
        output = output.replace('{{%TOTALTIME%}}', timeNumbers[2]).replace('{{%TTUNIT%}}', timeUnits[2]);
        output = output.replace('{{%SERVINGS%}}', recipe.recipeYield);
    
        let ingredientList = "";
        for(let i = 0; i < recipe.recipeIngredient.length; i++) {
            ingredientList = ingredientList.concat("<li>", recipe.recipeIngredient[i], "</li>");
        }
    
        output = output.replace('{{%INGREDIENTS LIST%}}', ingredientList);
    
        let instructionList = "";
        for(let i = 0; i < recipe.recipeInstructions.length; i++) {
            instructionList = instructionList.concat("<li>", recipe.recipeInstructions[i].text, "</li>");
        }
    
        output = output.replace('{{%INSTRUCTIONS%}}', instructionList)
    
        return output
    })
    response.end(html.replace("{{%CONTENT%}}", recipeHTMLArray));
});

app.post("/", function(request, response) {
    recipeName = "./allrecipes/".concat(request.body.searchinput, ".json").replace(/\ /g, '');
    console.log(recipeName);
    if(fs.existsSync(recipeName)) {
        recipeData = JSON.parse(fs.readFileSync(recipeName, 'utf-8'));
    }
    let recipeHTMLArray = recipeData.map((recipe) => {
        let output = recipeHTML.replace('{{%TITLE%}}', recipe.name);
    
        const timeNumbers = [];
        const timeUnits = [];
        timeNumbers.push(recipe.prepTime, recipe.cookTime, recipe.totalTime)
        timeUnits.push("Minutes", "Minutes", "Minutes")
    
        for(let i = 0; i < timeNumbers.length; i++) {
            timeNumbers[i] = timeNumbers[i].match(/\d/g);
            timeNumbers[i] = timeNumbers[i].join("");
            if(timeNumbers[i] >= 60) {
                timeNumbers[i] = timeNumbers[i]/60;
                timeUnits[i] = "Hours"
            }
        }
    
        output = output.replace('{{%PREPTIME%}}', timeNumbers[0]).replace('{{%PTUNIT%}}', timeUnits[0]);
        output = output.replace('{{%COOKTIME%}}', timeNumbers[1]).replace('{{%CTUNIT%}}', timeUnits[1]);
        output = output.replace('{{%TOTALTIME%}}', timeNumbers[2]).replace('{{%TTUNIT%}}', timeUnits[2]);
        output = output.replace('{{%SERVINGS%}}', recipe.recipeYield);
    
        let ingredientList = "";
        for(let i = 0; i < recipe.recipeIngredient.length; i++) {
            ingredientList = ingredientList.concat("<li>", recipe.recipeIngredient[i], "</li>");
        }
    
        output = output.replace('{{%INGREDIENTS LIST%}}', ingredientList);
    
        let instructionList = "";
        for(let i = 0; i < recipe.recipeInstructions.length; i++) {
            instructionList = instructionList.concat("<li>", recipe.recipeInstructions[i].text, "</li>");
        }
    
        output = output.replace('{{%INSTRUCTIONS%}}', instructionList)
    
        return output
    })
    response.end(html.replace("{{%CONTENT%}}", recipeHTMLArray));
});

//module.exports = app;

app.listen(process.env.PORT || 8080);
