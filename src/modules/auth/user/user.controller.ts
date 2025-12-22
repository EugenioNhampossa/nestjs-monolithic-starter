import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiGlobalResponse } from 'src/common/decorators';
import { ApiOffsetPaginatedResponse } from 'src/libs/pagination';
import { FilterUserDto, UserResponseDto } from './dto';
import { $Enums } from '@prisma/client';
import { Roles } from '../decorators';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles($Enums.Role.ADMIN)
  @ApiGlobalResponse(UserResponseDto)
  @ApiOperation({ description: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, $Enums.Provider.LOCAL);
  }

  @Get()
  @Roles($Enums.Role.ADMIN)
  @ApiOffsetPaginatedResponse(UserResponseDto)
  @ApiOperation({ description: 'Get all users with optional filters' })
  findAll(@Query() filter: FilterUserDto) {
    return this.userService.findAll(filter);
  }

  @Get(':id')
  @ApiGlobalResponse(UserResponseDto)
  @ApiOperation({ description: 'Get user by id' })
  async findById(@Param('id') id: string) {
    const { refreshToken: _, ...user } = await this.userService.findById(id);
    return user;
  }

  @Put(':id')
  @ApiOperation({ description: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'OK' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles($Enums.Role.ADMIN)
  @ApiOperation({ description: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
