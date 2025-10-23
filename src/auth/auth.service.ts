import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;
        const valid = await bcrypt.compare(pass, user.password);
        if (valid) return{ id: user.id, username: user.username, role: user.role };
        return null;
    }

    async login(user: { id: number; username: string; role: string }) {
        const paylaod = { sub: user.id, username: user.username, role: user.role };
        const accessToken = this.jwtService.sign(paylaod);

        //create refresh token using separate secret so you can revoke acces by changing refresh secret
    const refreshToken = jwt.sign(
        paylaod,
        process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secrete',
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    //store refresh token in DB (plain text or hashed
    //for better security, has the refresh token before storing. Here we'll store plain for simplicity
    await this.usersService.setRefreshToken (user.id, refreshToken);

    return { accessToken, refreshToken };
}

async logout (userId: number) {
    await this.usersService.setRefreshToken (userId, null);
    return { ok: true };
}

async refreshTokens (refreshToken: string) {
    try {
        const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN || 'refresh_secrete');
        const user = await this.usersService.findById(decoded.sub);
        if (!user) throw new UnauthorizedException('Invalid refresh token');
        //check stored token matches
        const stored = await this.usersService.findById(decoded.sub);
        const poolUser = await this.usersService.findById(decoded.sub);
        //we need to ckeck stored refresh_token
        const u = await this.usersService.findById(decoded.sub);
        //instead of repeated calls, use method that fetches only refresh token
        const found = await this.usersService.findByRefreshToken(refreshToken); 
        if (!found) throw new UnauthorizedException('Invalid refresh token (not found)');
    
        const payload  = {sub: found.id, username: found.username, role: found.role };
        const accessToken = this.jwtService.sign(payload);
        const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secrete',{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
        });
        await this.usersService.setRefreshToken(found.id, newRefreshToken);
        return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
        throw new UnauthorizedException('Could not refresh tokens');
        }
    }
}