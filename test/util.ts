import { BadRequest, NotFound } from '@curveball/http-errors';
import { expect } from 'chai';

import { doesMatchRoute, validateFile, getMimeType } from '../src/util';

describe('doesMatchRoute', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should match routes', () => {
    expect(doesMatchRoute(staticDir, '/assets/test.txt')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets/deeper/test.txt')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets')).to.be.true;
    expect(doesMatchRoute(staticDir, '/assets/deeper/../test.txt')).to.be.true;
  });

  it('should not match routes', () => {
    expect(doesMatchRoute(staticDir, '/static/test.txt')).to.be.false;
    expect(doesMatchRoute(staticDir, '/')).to.be.false;
  });
});

describe('validateFile', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should validate file', () => {
    validateFile(staticDir, '/assets/test.txt');
    validateFile(staticDir, '/assets/nested/test.txt');
    validateFile(staticDir, '/assets/nested/../test.txt');
  });

  it('should not validate file', () => {
    expect(() => validateFile(staticDir, '/assets')).to.throw(BadRequest);
    expect(() => validateFile(staticDir, '/assets/test.nope')).to.throw(NotFound);
    expect(() => validateFile(staticDir, '/')).to.throw(BadRequest);
    expect(() => validateFile(staticDir, '/assets/nested')).to.throw(BadRequest);
    expect(() => validateFile(staticDir, '/assets/../')).to.throw(BadRequest);
    expect(() => validateFile(staticDir, '/assets/../util.ts')).to.throw(BadRequest);
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