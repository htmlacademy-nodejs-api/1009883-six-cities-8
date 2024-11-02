import { Request } from 'express';

import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { GetOffersQueryDto } from '../dto/get-offers-query.dto.js';

export type AllOffersRequest = Request<
  RequestParams,
  RequestBody,
  RequestBody,
  GetOffersQueryDto
>;
