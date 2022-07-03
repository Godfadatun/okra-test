import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/update-user.dto';
// import { AuthGuard } from '@nestjs/passport';
import { PrincipalGuard } from './guards/principal.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(PrincipalGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(PrincipalGuard)
  @Get('')
  findAll(@Request() req) {
    console.log({ req: req.user });
    return this.usersService.findAll();
  }
}
