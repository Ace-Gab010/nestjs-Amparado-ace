import {Controller, Post, Body, UseGuards, Request, Get, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

    @Post('register')
    async register(@Body() body: { username?: string; password?: string }) {
        // validate required fields
        if (!body || !body.username || typeof body.username !== 'string') {
          throw new BadRequestException('username is required and must be a string');
        }
        if (!body.password || typeof body.password !== 'string') {
          throw new BadRequestException('password is required and must be a string');
        }
        return this.userService.createUser(body.username, body.password);
    }

    @Post('login')
    async login(@Body()body: {username: string; password: string}) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) return {error: 'Invalid credentials' };
        return this.authService.login(user);
        }
    
    @Post('Logout')
    async logout (@Body() body: { userId: number}) {
        return this.authService.logout(body.userId);
    }

    @Post('refresh')
    async refresh(@Body () body: {refreshToken: string}) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}