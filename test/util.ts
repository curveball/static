import { BadRequest, NotFound } from '@curveball/http-errors';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { doesMatchRoute, validateFile, getMimeType } from '../src/util';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('doesMatchRoute', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should match routes', () => {
    expect(doesMatchRoute(staticDir, '/assets/test.txt')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets/deeper/test.txt')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets/deeper/../test.txt')).to.be.true;
  });

  it('should not match routes', () => {
    // Beginning folder of path is wrong
    expect(doesMatchRoute(staticDir, '/static/test.txt')).to.be.false;
    // Access incorrect directory
    expect(doesMatchRoute(staticDir, '/')).to.be.false;
  });
});

describe('validateFile', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should validate file', async () => {
    await expect(validateFile(staticDir, '/assets/test.txt')).to.be.fulfilled;
    await expect(validateFile(staticDir, '/assets/nested/test.txt')).to.be.fulfilled;
    await expect(validateFile(staticDir, '/assets/nested/../test.txt')).to.be.fulfilled;
  });

  it('should not validate file', async () => {
    // Directory
    await expect(validateFile(staticDir, '/assets')).to.be.rejectedWith(BadRequest);
    // File doesn't exist
    await expect(validateFile(staticDir, '/assets/test.nope')).to.be.rejectedWith(NotFound);
    // Wrong directory
    await expect(validateFile(staticDir, '/')).to.be.rejectedWith(BadRequest);
    // Nested directory
    await expect(validateFile(staticDir, '/assets/nested')).to.be.rejectedWith(BadRequest);
    // Relative path to directory
    await expect(validateFile(staticDir, '/assets/../')).to.be.rejectedWith(BadRequest);
    // Relative path to missing file
    await expect(validateFile(staticDir, '/assets/../util.ts')).to.be.rejectedWith(BadRequest);
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
