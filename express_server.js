function generateRandomString() {
  //function to generate random numbers
  return Math.random().toString(20).substr(2, 6);
}
const express = require("express");
const app = express();
const PORT = 8080;
const users = {};
function userLookup(email) {
  for (let id in users) {
    const userObj = users[id]
    if (userObj.email === email) {
      return userObj;
    }   
  }
    return null;
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

var cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" }



  app.post("/login", (req, res) => {
    const {email, password} = req.body;
    const newUser = userLookup(email, users);
    if (!newUser) {
      return res.status(403).send("Email cannot be found")
    } else if (newUser.password !== password) {
       return res.status(403).send("Password incorrect")
      }
    const id = newUser.id
    res.cookie("user_id", id);
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
    res.clearCookie("user_id", { path: 'templateVars'})
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
    if (email === "" || password === "") {
      return res.status(400).send("Email and/or password empty")
    }
       else if (userLookup(email, users)) {
        return res.status(400).send("Email already registered")
    }
    const id = generateRandomString()
    users[id] = {
      id,
      email,
      password
    }
    res.cookie("user_id", id);   
    res.redirect("/urls");
  })

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
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id],
  };
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
  const templateVars = {user: users[req.cookies.user_id]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id],
  };
  res.render("urls_show", templateVars);
});



// function generateRandomString() {
//   //function to generate random numbers
//   return Math.random().toString(20).substr(2, 6);
// }
// const express = require("express");
// const app = express();
// const PORT = 8080;
// const users = {
//   // userRandomID: {
//   //   id: "userRandomID",
//   //   email: "user@example.com",
//   //   password: "purple-monkey-dinosaur",
//   // },
//   // user2RandomID: {
//   //   id: "user2RandomID",
//   //   email: "user2@example.com",
//   //   password: "dishwasher-funk",
//   // },
// };
// var cookieParser = require('cookie-parser')
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com" }



//   app.post("/login", (req, res) => {
//     const {} = req.body;
//     res.cookie("username", username);
//     res.redirect("/urls");
//   })

//   app.post("/logout", (req, res) => {
//     res.clearCookie("username", { path: 'templateVars'})
//     res.redirect("/urls");
//   });
  
//   app.get("/register", (req, res) => {
//     let templateVars = {
//       username: urlDatabase[req.body.username_id]
//     };
//     if (templateVars.username) {
//       res.redirect("/urls");
//     } else {
//       res.render("urls_register", templateVars);      
//     }
//   });

//   app.post("/register", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const id = generateRandomString()
//     users[id] = {
//       id,
//       email,
//       password
//     }
//     // const newUser = Object.assign(users, userObject)
//     // console.log("this is the user:", userObject);
//     // console.log("this is the users", users)
//     res.cookie("user_id", id);   
//     res.redirect("/urls");
//   })

//   app.get("/u/:id", (req, res) => {
//     const longURL = urlDatabase[req.params.id];
//   res.redirect(longURL);
//   });
  
//   app.post("/urls", (req, res) => {
//     const shortCode = generateRandomString();
//     const longUrl = req.body.longURL;
//     urlDatabase[shortCode] = longUrl;
//     res.send("Ok");
// });

//   app.post("/urls/:id/delete", (req, res) => {
//     delete urlDatabase[req.params.id];
//     res.redirect("/urls");
//   });

//   app.post("/urls/:id", (req, res) => {
//     const shortCode = req.params.id;
//     const longUrl = req.body.longURL;
//     urlDatabase[shortCode] = longUrl;
//     res.redirect("/urls");
//     console.log(longUrl);
//     console.log(req.params);
//   });

// app.set("view engine", "ejs");

// app.get("/urls", (req, res) => {
//   let templateVars = {
//     user: users[req.session.user_id],
//   };
//    res.render("urls_index", templateVars);
//     });

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}!`);
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new", templateVars);
// });

// app.get("/urls/:id", (req, res) => {
//   const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
//   res.render("urls_show", templateVars);
// });
