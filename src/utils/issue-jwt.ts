import "dotenv";
import jsonwebtoken from "jsonwebtoken";

export function issueJWT(user: any) {
  const id = user.id;
  const expiresIn = "7d";
  const payload = {
    sub: id,
  };
  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.ACCESS_TOKEN as string,
    {
      expiresIn: expiresIn,
    }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}
