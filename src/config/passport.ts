import "dotenv/config";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

import { prisma } from "../lib/prisma";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN,
};

const strategy = new JwtStrategy(options as any, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(strategy);
