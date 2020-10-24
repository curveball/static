import fs from 'fs';
import path from 'path';

import { BadRequest, NotFound } from '@curveball/http-errors';
import mime from 'mime-types';

import { Options } from './types';

const fsPromises = fs.promises;

export function doesMatchRoute(options: Options, requestPath: string): boolean {
  const staticFolder = options.pathPrefix ? options.pathPrefix.replace('/', '') : options.staticDir.split('/').pop();
  const pathFolder = requestPath.split('/')[1];

  // Verify that the static asset asked for in the request matches the static folder
  return staticFolder === pathFolder;
}

export async function validateFile(filePath: string, staticDir: string): Promise<void> {
  // Only serve files that are within the static directory
  const relativePath = path.relative(staticDir, filePath);
  if (relativePath.startsWith('../')) {
    throw new BadRequest('Invalid path');
  }

  // The file needs to exist and be accessible
  try {
    await fsPromises.access(filePath);
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
