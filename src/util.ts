import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { BadRequest, NotFound } from '@curveball/http-errors';
import * as mime from 'mime-types';

import { Options } from './types.js';

export function getStaticPrefix(options: Options): string {
  return options.pathPrefix ? options.pathPrefix : `/${options.staticDir.split('/').pop()}`;
}

export function doesMatchRoute(options: Options, requestPath: string): boolean {
  return requestPath.startsWith(getStaticPrefix(options));
}

export function getFilePath(options: Options, requestPath: string): string {
  return `${options.staticDir}${requestPath}`.replace(getStaticPrefix(options), '');
}

export async function validateFile(filePath: string, staticDir: string): Promise<void> {
  // Only serve files that are within the static directory
  const relativePath = path.relative(staticDir, filePath);
  if (relativePath.startsWith('../')) {
    throw new BadRequest('Invalid path');
  }

  // The file needs to exist and be accessible
  try {
    await fs.access(filePath);
  } catch (e: any) {
    if (['ENOENT'].includes(e.code)) {
      throw new NotFound('Cannot find file');
    }
    throw e;
  }

  // Only serve files (ex. not directories or symlinks)
  if (!(await fs.stat(filePath)).isFile()) {
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
