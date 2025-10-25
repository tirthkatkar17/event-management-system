// hash_generator.js
const bcrypt = require('bcrypt');

const passwordToHash = "admin123"; // The desired password
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds, function(err, hash) {
    if (err) throw err;
    console.log("--- USE THIS HASH FOR YOUR ADMIN INSERT/UPDATE COMMAND ---");
    console.log(hash); 
    console.log("---------------------------------------------------------");
});