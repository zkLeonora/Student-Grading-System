import bcrypt from "bcrypt";

const password = "hashedurpassword";
const hashedPassword = await bcrypt.hash(password, 10);

console.log(hashedPassword);