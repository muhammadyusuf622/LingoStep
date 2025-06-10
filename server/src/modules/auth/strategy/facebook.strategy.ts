import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-facebook";


@Injectable()
export class FaceBookStrategy extends PassportStrategy(Strategy, 'facebook') {

  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'displayName', 'emails'],
    });
  }


    async validate(
    accsessToken: any,
    refreshToken: any,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const user = {
      email: profile?.emails?.[0]?.value,
      firstName: profile?._json?.name,
    };

    done(null, user);
  }
}