import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { IErrorResponse } from 'src/common/interfaces';

export const ApiGlobalResponse = <TModel extends Type<any>>(model?: TModel) => {
  return applyDecorators(
    ApiOkResponse({ type: model }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiBadRequestResponse({
      type: IErrorResponse,
      description: 'Bad request',
    }),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({ description: 'Server error' }),
  );
};
