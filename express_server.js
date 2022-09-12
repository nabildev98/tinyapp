function generateRandomString() {
  //function to generate random numbers
  return Math.random().toString(20).substr(2, 6);
}
const express = require("express");
const app = express();
const PORT = 8080;
var cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" }

  app.post("/login", (req, res) => {
    const {username} = req.body;
    res.cookie("username", username);
    res.redirect("/urls");
  })

  app.post("/logout", (req, res) => {
    res.clearCookie("username", { path: 'templateVars'})
    res.redirect("/urls");
  });
  
  app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
  });
  
  app.post("/urls", (req, res) => {
    const shortCode = generateRandomString();
    const longUrl = req.body.longURL;
    urlDatabase[shortCode] = longUrl;
    res.send("Ok");
});

  app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  });

  app.post("/urls/:id", (req, res) => {
    const shortCode = req.params.id;
    const longUrl = req.body.longURL;
    urlDatabase[shortCode] = longUrl;
    res.redirect("/urls");
    console.log(longUrl);
    console.log(req.params);
  });

app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  let username;
if(req.cookies){
      username = req.cookies["username"]
} else {
      username = false;
}
const templateVars = { urls: urlDatabase, username: username};

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
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});
