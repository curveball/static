import fs from 'fs';

import { Context, Middleware } from '@curveball/core';

import { doesMatchRoute, validateFile, getMimeType } from './util';

export type Options = {
  staticDir: string,
}

export function serveFiles(options: Options): Middleware {
  return (ctx: Context, next) => {
    serve(options, ctx);
    next();
  };
}

export function serve(options: Options, ctx: Context): void {
  const { staticDir } = options;
  const { path: requestPath } = ctx.request;

  if (!doesMatchRoute(staticDir, requestPath)) {
    return;
  }

  validateFile(staticDir, requestPath);

  const filePath = staticDir + '/' + requestPath.split('/').slice(2).join('/');
  ctx.status = 200;
  ctx.response.body = fs.readFileSync(filePath);
  ctx.response.type = getMimeType(filePath);
}