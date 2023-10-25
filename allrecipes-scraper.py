import requests
from bs4 import BeautifulSoup
import json
import re
import os

recipeDictionary = {"Null":{"fileName": "", "recipeName": "", "recipeURL": ""}}
recipeDatabase = """CREATE TABLE recipe(
    id SERIAL PRIMARY KEY NOT NULL,
    recipe_name VARCHAR NOT NULL,

);

INSERT INTO recipe
VALUES
"""

mainURL = "https://www.allrecipes.com/recipes-a-z-6735880"
mainPage = requests.get(mainURL)

mainSoup = BeautifulSoup(mainPage.content, "html.parser")
mainResults = mainSoup.find(id = "alphabetical-list_1-0")

topicElements = mainResults.find_all("li", class_ = "comp link-list__item")

for topicElement in topicElements:
    topicURL = topicElement.find("a")["href"]
    topicPage = requests.get(topicURL)

    topicSoup = BeautifulSoup(topicPage.content, "html.parser")
    topicResults = topicSoup.find(id = "tax-sc__recirc-list_1-0")

    recipeElements = topicResults.find_all("a", class_ = "comp mntl-card-list-items mntl-document-card mntl-card card card--no-image")

    for recipe in recipeElements:
        recipeURL = recipe["href"]
        recipePage = requests.get(recipeURL)

        recipeSoup = BeautifulSoup(recipePage.content, "html.parser")
        recipeName = recipeSoup.find("h1", id = "article-heading_1-0").text.replace("\n", "")
        title = recipeName.replace(" ", "-")
        title = re.sub(r'[^\w\s]', '', title)
        fullTitle = title + ".json"
        #print(recipeName)
        writePath = "./allrecipes"
        fileName = os.path.join(writePath, fullTitle)
        
        recipeJSON = recipeSoup.find("script", id = "allrecipes-schema_1-0").get_text()

        with open(fileName, "w", encoding="utf+8") as file:
            file.write(str(recipeJSON))

        #f = open(fileName)
        #readJSON = json.load(f)
        #print(readJSON[0]["name"])
        #f.close

        recipeDictionary[title.lower()] = {}
        recipeDictionary[title.lower()]["fileName"] = fullTitle
        recipeDictionary[title.lower()]["recipeName"] = recipeName
        recipeDictionary[title.lower()]["recipeURL"] = ""    

        recipeDatabase += "(DEFAULT, \'" + fullTitle + "\',\'" + recipeName + "\'),\n"

with open("recipe-dictionary.json", "w") as dirFile:
    dirFile.write(json.dumps(recipeDictionary, indent=4))

recipeDatabase = recipeDatabase[:-1] + ";"

with open("recipe-database.sql", 'w') as dbFile:
    dbFile.write(recipeDatabase)