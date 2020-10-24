import { BadRequest, NotFound } from '@curveball/http-errors';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { doesMatchRoute, validateFile, getMimeType } from '../src/util';

chai.use(chaiAsPromised);
const expect = chai.expect;

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
  });

  it('should match not routes with pathPrefix', () => {
    expect(doesMatchRoute({ staticDir, pathPrefix: '/static' }, '/assets/test.txt')).to.be.false;
  });
});

describe('validateFile', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should validate file', async () => {
    await expect(validateFile(`${staticDir}/test.txt`, staticDir)).to.be.fulfilled;
    await expect(validateFile(`${staticDir}/nested/test.txt`, staticDir)).to.be.fulfilled;
    await expect(validateFile(`${staticDir}/nested/../test.txt`, staticDir)).to.be.fulfilled;
  });

  it('should not validate file', async () => {
    // Directory
    await expect(validateFile(`${staticDir}/`, staticDir)).to.be.rejectedWith(BadRequest);
    // File doesn't exist
    await expect(validateFile(`${staticDir}/test.nope`, staticDir)).to.be.rejectedWith(NotFound);
    // Nested directory
    await expect(validateFile(`${staticDir}/nested`, staticDir)).to.be.rejectedWith(BadRequest);
    // Relative path to directory
    await expect(validateFile(`${staticDir}/../`, staticDir)).to.be.rejectedWith(BadRequest);
    // Relative path to missing file
    await expect(validateFile(`${staticDir}/../util.ts`, staticDir)).to.be.rejectedWith(BadRequest);
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
