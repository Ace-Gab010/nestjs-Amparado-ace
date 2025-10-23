import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secrete',
        });
    }

    async validate(payload: any) {
        //paylaod contains { sub, username, role}
        return { id: payload.sub, username: payload.username, role: payload.role };
    }       
}