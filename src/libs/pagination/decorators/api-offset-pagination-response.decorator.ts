import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OffsetPaginationResponseDto } from '../dtos/offset-pagination-response.dto';
import { IErrorResponse } from 'src/common/interfaces';

export const ApiOffsetPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({ type: OffsetPaginationResponseDto<typeof model> }),
    ApiBadRequestResponse({
      type: IErrorResponse,
      description: 'Bad request',
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({ description: 'Server error' }),
  );
};
