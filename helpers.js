



function getUserByEmail(email, users) {
  for (let id in users) {
    const userObj = users[id]
    if (userObj.email === email) {
      return userObj;
    }   
  }
  return null;
}

module.exports = {getUserByEmail};