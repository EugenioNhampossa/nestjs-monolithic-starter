import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { HashHelper } from 'src/helpers';
import { FilterUserDto } from './dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(dto: CreateUserDto, provider: $Enums.Provider) {
    const userExists = await this.repository.findByEmail(dto.email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const { password, ...data } = dto;
    const hashedPassword = await HashHelper.encrypt(password);
    return await this.repository.create(
      {
        password: hashedPassword,
        ...data,
      },
      provider,
    );
  }

  async findAll(filter: FilterUserDto) {
    return await this.repository.findAll(filter);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async findByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async update(id: string, dto: UpdateUserDto) {
    return await this.repository.update(id, dto);
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return await this.repository.updateRefreshToken(userId, hashedRefreshToken);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
