import fs from 'fs';

import { Context, Middleware } from '@curveball/core';

import { Options } from './types';
import { doesMatchRoute, validateFile, getMimeType } from './util';

const fsPromises = fs.promises;

export function serveFiles(options: Options): Middleware {
  return async (ctx: Context, next) => {
    const fileServed = await serve(options, ctx);

    if (!fileServed) {
      return next();
    }
  };
}

export async function serve(options: Options, ctx: Context): Promise<boolean> {
  const { staticDir } = options;
  const { path: requestPath } = ctx.request;

  if (!doesMatchRoute(options, requestPath)) {
    return false;
  }

  const filePath = `${staticDir}/${requestPath.split('/').slice(2).join('/')}`;

  await validateFile(filePath, staticDir);

  ctx.status = 200;
  ctx.response.body = await fsPromises.readFile(filePath);
  ctx.response.type = getMimeType(filePath);
  return true;
}
