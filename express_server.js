
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const express = require("express");
const PORT = 8080;
const app = express();
const {getUserByEmail} = require('./helpers');

app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ["random"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


function generateRandomString() {
  //function to generate random numbers
  return Math.random().toString(20).substr(2, 6);
}

const users = {};


function urlsForUser (user_id) {
  const userUrls = {};
  // if (user_id) {
    for (let key in urlDatabase) {
      if (urlDatabase[key].userID === user_id) {
        userUrls[key] = urlDatabase[key];
      }
      console.log(urlDatabase[key].userID, user_id);
    }     
    // }
    return userUrls;
  }

// userDatabase = {
//   abc123:{
//     id: abc123,
//     email: "a@gmail.com",
//     password
//   },
//   bbb123: {
//     id: bbb123,
//     email: "b@gmail.com",
//     password
//   }
// }
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};


  app.post("/login", (req, res) => {
    const {email, password} = req.body;
    const newUser = getUserByEmail(email, users);
    if (!newUser) {
      return res.status(403).send("Email cannot be found")
    // } else if (newUser.password !== password) {
      } 
      const test = bcrypt.compareSync(password, newUser.password)
    if (!test) {
       return res.status(403).send("Password incorrect")
      } 
    const id = newUser.id
    req.session.user_id = id;
    res.redirect("/urls");
  })

  app.get("/login", (req, res) => {
    let templateVars = {
      user: users[req.body.user_id]
    };
    if (templateVars.user) {
      res.redirect("/urls");
    } else {
      res.render("urls_login", templateVars);      
    }
  });



  app.post("/logout", (req, res) => {
    req.session = null
    res.redirect("/urls");
  });
  
  app.get("/register", (req, res) => {
    let templateVars = {
      user: users[req.body.user_id]
    };
    if (templateVars.user) {
      res.redirect("/urls");
    } else {
      res.render("urls_register", templateVars);      
    }
  });

  app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (email === "") {
      return res.status(400).send("Email empty")
    }  
    if (password === "") {
      return res.status(400).send("Password empty")
    }
    if (getUserByEmail(email, users)) {
      return res.status(400).send("Email already registered")
    }
    const id = generateRandomString()
    users[id] = {
      id,
      email,
      password:hashedPassword
    }
    req.session.user_id = id;   
    res.redirect("/urls");
  })

  app.get("/u/:id", (req, res) => {
    const longUrl = urlDatabase[req.params.id].longUrl;
  res.redirect(longUrl);
  });
  
  app.post("/urls", (req, res) => {
    if (!req.session.user_id) {
      return res.status(401).send("You need to be logged in to perform action")     
    } else {
    const shortCode = generateRandomString();
    const longUrl = req.body.longUrl;
    urlDatabase[shortCode] = {longUrl, userID: req.session.user_id};
    res.redirect("/urls");
    }
});

  app.post("/urls/:id/delete", (req, res) => {
    if (!req.session.user_id) {
      return res.status(401).send("You need to be logged in to perform action")
    }
    if (req.session.user_id !== urlDatabase[req.params.id].userID) {
      return res.status(403).send("You don't have permission")
    } 
    if (!urlDatabase[req.params.id]) {
      console.log(req.params.id)
      return res.status(401).send("TinyURL does not exist")
    } else {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
    }
  });

  app.post("/urls/:id", (req, res) => {
    const shortCode = req.params.id;
    const longUrl = req.body.longUrl;
    // urlDatabase[shortCode] = {longUrl, userId:null};
    urlDatabase[shortCode].longUrl = longUrl;
    res.redirect("/urls");
    console.log(longUrl);
    console.log(req.params);
  });

app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  if (req.session.user_id) {
  let templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  }
  res.render("urls_index", templateVars);
  } else {
    return res.status(401).send("You need to be logged in to perform action <a href='/login'>login</a>")
  } 
});



app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
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
  let templateVars = {user: users[req.session.user_id]};
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
  res.render("urls_login", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send("You need to be logged in to perform action")
  }
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.status(403).send("You don't have permission")
  } 
  if (!urlDatabase[req.params.id]) {
    console.log(req.params.id)
    return res.status(401).send("TinyURL does not exist")
  } else {
  const templateVars = { id: req.params.id, longUrl: urlDatabase[req.params.id].longUrl, user: users[req.session.user_id],
  };
  res.render("urls_show", templateVars);
}
});
