import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { PositionService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private usersService: PositionService) {}

  //REGISTRATION ADDED


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
    return this.usersService.findByPosition_id(+id);
  }

  // Create position (protected)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { position_code?: string; position_name?: string }, @Req() req: any) {
    if (!req || !req.user || (typeof req.user.id === 'undefined' && typeof req.user.userId === 'undefined')) {
      throw new BadRequestException('Authenticated user information is missing');
    }

    const position_code = body.position_code;
    const position_name = body.position_name;
    if (!position_code || typeof position_code !== 'string') {
      throw new BadRequestException('position_code is required and must be a string');
    }
    if (!position_name || typeof position_name !== 'string') {
      throw new BadRequestException('position_name is required and must be a string');
    }

    const userId = typeof req.user.id !== 'undefined' ? req.user.id : req.user.userId;
    return this.usersService.create(position_code, position_name, userId);
  }

  // Update user (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updatePosition(+id, body);
  }

  // Delete position (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deletePosition(+id);
  }
}
