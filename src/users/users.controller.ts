import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //REGISTRATION ADDED

  @Post ('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.register(username, password);
      return { id: user.id, username: user.username, role: user.role };
    } catch (err: any) {
      const mesasage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as any) .message
          : String(err) || 'Registration failed';
      throw new BadRequestException(err?.message || 'Registration failed');
    }
  }

  // Get all users (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // Get single user by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  // Create user (open - for demo)
  @Post()
  async create(@Body() body: { username: string; password: string }) {
    return this.usersService.createUser(body.username, body.password);
  }

  // Update user (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(+id, body);
  }

  // Delete user (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
