import { Request } from 'express';

import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { Query } from 'express-serve-static-core';

export type AllOffersRequest = Request<
  RequestParams,
  RequestBody,
  RequestBody,
  { count: string } | Query
>;
