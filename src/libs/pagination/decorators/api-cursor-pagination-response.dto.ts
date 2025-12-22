import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CursorPaginationQuery } from '../dtos/cursor-pagination-request.dto';
import { CursorPaginationResponseDto } from '../dtos/cursor-pagination-response.dto';

export const ApiOffsetPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiQuery({ type: CursorPaginationQuery }),
    ApiOkResponse({ type: CursorPaginationResponseDto<typeof model> }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({ description: 'Server error' }),
  );
};
