const crypto = require("crypto");

const generateJWTSecret = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  console.log(`Generated JWT secret: ${secret}`);
};

generateJWTSecret();
