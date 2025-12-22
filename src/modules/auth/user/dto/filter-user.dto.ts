import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { OffsetPaginationQuery } from 'src/libs/pagination';

export class FilterUserDto extends IntersectionType(
  PartialType(OmitType(CreateUserDto, ['password'] as const)),
  OffsetPaginationQuery,
) {}
