import fs from 'fs';

import { Context, Middleware } from '@curveball/core';

import { doesMatchRoute, validateFile, getMimeType } from './util';

const fsPromises = fs.promises;

export type Options = {
  staticDir: string,
}

export function serveFiles(options: Options): Middleware {
  return async (ctx: Context, next) => {
    await serve(options, ctx);
    next();
  };
}

export async function serve(options: Options, ctx: Context): Promise<void> {
  const { staticDir } = options;
  const { path: requestPath } = ctx.request;

  if (!doesMatchRoute(staticDir, requestPath)) {
    return;
  }

  await validateFile(staticDir, requestPath);

  const filePath = staticDir + '/' + requestPath.split('/').slice(2).join('/');

  ctx.status = 200;
  ctx.response.body = await fsPromises.readFile(filePath);
  ctx.response.type = getMimeType(filePath);
}