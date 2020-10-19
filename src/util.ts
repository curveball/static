import fs from 'fs';
import path from 'path';

import { BadRequest, NotFound } from '@curveball/http-errors';
import mime from 'mime-types';

const fsPromises = fs.promises;

export function doesMatchRoute(staticDir: string, requestPath: string): boolean {
  const staticFolder = staticDir.split('/').pop();
  const pathFolder = requestPath.split('/')[1];

  // The last folder in the static path and the first folder in the request
  // path need to be the same for this middleware to match. This is so every
  // single request is not evaluated as if it's a file
  if (staticFolder === pathFolder) {
    return true;
  }

  return false;
}

export async function validateFile(staticDir: string, requestPath: string): Promise<void> {
  const filePath = staticDir + '/' + requestPath.split('/').slice(2).join('/');

  // Only serve files that are within the static directory
  const relativePath = path.relative(staticDir, filePath);
  if (relativePath.startsWith('../')) {
    throw new BadRequest('Invalid path');
  }

  // The file needs to exist and be accessible
  try {
    fs.accessSync(filePath);
  } catch (e) {
    if (['ENOENT'].includes(e.code)) {
      throw new NotFound('Cannot find file');
    }
    throw e;
  }

  // Only serve files (ex. not directories or symlinks)
  if (!(await fsPromises.stat(filePath)).isFile()) {
    throw new BadRequest('Invalid path');
  }


}

export function getMimeType(filePath: string): string {
  let mimeType = 'application/octet-stream';
  const derivedMimeType = mime.lookup(path.extname(filePath));
  if (derivedMimeType) {
    mimeType = derivedMimeType;
  }

  return mimeType;
}