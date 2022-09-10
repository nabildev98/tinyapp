function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" }
  
  app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
  });
  
  app.post("/urls", (req, res) => {
    console.log(req.body); 
    const shortCode = generateRandomString();
    const longUrl = req.body;
    urlDatabase[shortCode] = longUrl;
    res.send("Ok"); 
});

  app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  });


app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  
  const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
    });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});
