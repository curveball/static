import { BadRequest, NotFound } from '@curveball/http-errors';
import * as chai from 'chai';

import { doesMatchRoute, getFilePath, getMimeType, getStaticPrefix, validateFile } from '../src/util.js';

const expect = chai.expect;

describe('getStaticPrefix', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should get prefix from static directory', () => {
    expect(getStaticPrefix({ staticDir })).to.equal('/assets');
  });

  it('should get prefix from option', () => {
    expect(getStaticPrefix({ staticDir, pathPrefix: '/static' })).to.equal('/static');
  });
});

describe('getFilePath', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should return path', () => {
    expect(getFilePath({ staticDir }, '/assets/test.txt')).to.equal(`${staticDir}/test.txt`);
  });
});

describe('doesMatchRoute', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should match routes', () => {
    expect(doesMatchRoute({ staticDir }, '/assets/test.txt')).to.be.true;
    expect(doesMatchRoute({ staticDir }, '/assets/deeper/test.txt')).to.be.true;
    expect(doesMatchRoute({ staticDir }, '/assets')).to.be.true;
    expect(doesMatchRoute({ staticDir }, '/assets/deeper/../test.txt')).to.be.true;
  });

  it('should not match routes', () => {
    // Beginning folder of path is wrong
    expect(doesMatchRoute({ staticDir }, '/static/test.txt')).to.be.false;
    // Access incorrect directory
    expect(doesMatchRoute({ staticDir }, '/')).to.be.false;
  });

  it('should match routes with pathPrefix', () => {
    expect(doesMatchRoute({ staticDir, pathPrefix: '/static' }, '/static/test.txt')).to.be.true;
    expect(doesMatchRoute({ staticDir, pathPrefix: '/static/more' }, '/static/more/test.txt')).to.be.true;
  });

  it('should match not routes with pathPrefix', () => {
    expect(doesMatchRoute({ staticDir, pathPrefix: '/static' }, '/assets/test.txt')).to.be.false;
  });
});

describe('validateFile', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should validate file', async () => {
    await validateFile(`${staticDir}/test.txt`, staticDir);
    await validateFile(`${staticDir}/nested/test.txt`, staticDir);
    await validateFile(`${staticDir}/nested/../test.txt`, staticDir);
  });

  it('should not validate file', async () => {

    await assertReject(
      validateFile(`${staticDir}/`, staticDir),
      BadRequest
    );
    await assertReject(
      // File doesn't exist
      validateFile(`${staticDir}/test.nope`, staticDir),
      NotFound
    );
    await assertReject(
      // Nested directory
      validateFile(`${staticDir}/nested`, staticDir),
      BadRequest
    );
    await assertReject(
      // Relative path to directory
      validateFile(`${staticDir}/../`, staticDir),
      BadRequest
    );
    await assertReject(
      // Relative path to missing file
      validateFile(`${staticDir}/../util.ts`, staticDir),
      BadRequest
    );

  });

});

describe('getMimeType', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should return correct type', () => {
    expect(getMimeType(staticDir + '/test.css')).to.equal('text/css');
    expect(getMimeType(staticDir + '/test.txt')).to.equal('text/plain');
  });

  it('should return default type if unknown', () => {
    expect(getMimeType(staticDir + '/test.na')).to.equal('application/octet-stream');
  });

});

async function assertReject(promise: Promise<unknown>, expectedException: any) {

  try {
    await promise;
    throw new Error('This promise should have rejected, but it didn\'t');
  } catch (err) {

    expect(err).to.be.an.instanceof(expectedException);

  }

}
