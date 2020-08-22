import { Context, Middleware } from '@curveball/core';
import { BadRequest, NotFound } from '@curveball/http-errors';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';

export type Options = {
  staticDir: string,
}

export default function serveFiles(options: Options): Middleware {
  return async (ctx: Context, next) => {
    serve(options.staticDir, ctx);
    return next();

  };
}

function serve(staticDir: string, ctx: Context) {
  const pathPieces = ctx.request.path.split('/');

  if (!staticDir.endsWith(pathPieces[1])) {
    return;
  }

  const filePath = staticDir + '/' + pathPieces.slice(2).join('/');

  validateFile(filePath);

  ctx.response.body = fs.readFileSync(filePath);
  ctx.response.type = getMimeType(filePath);
}

function validateFile(filePath: string) {
  try {
    fs.accessSync(filePath)
  } catch (e) {
    console.error(e)
    if (e.code in ['ENOENT']) {
      throw new NotFound('Cannot find file');
    }
    throw e;
  }

  const fileStat = fs.statSync(filePath);

  if (!fileStat.isFile()) {
    throw new BadRequest('Invalid path');
  }
}

function getMimeType(filePath: string) {
  let mimeType = 'application/octet-stream';
  const derivedMimeType = mime.lookup(path.extname(filePath));
  if (derivedMimeType) {
    mimeType = derivedMimeType;
  }

  return mimeType;
}