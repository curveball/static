import { expect } from 'chai';

import { buildContext, mwInvoke } from './helpers';
import { serveFiles, serve } from '../src/serve';

describe('serveFiles', () => {
  it('should return the requested file', async () => {
    const ctx = buildContext(
      '/assets/test.txt'
    );

    await mwInvoke(
      serveFiles({
        staticDir: `${process.cwd()}/test/assets`,
      }),
      ctx
    );

    expect(ctx.response.body instanceof Buffer).to.be.true;
    expect(ctx.response.body.toString()).to.equal('test static file');
    expect(ctx.response.type).to.equal('text/plain');
  });

  it('should serve nothing if the route does not match', async () => {
    const ctx = buildContext(
      '/nothing/test.txt'
    );

    await mwInvoke(
      serveFiles({
        staticDir: `${process.cwd()}/test/assets`,
      }),
      ctx
    );

    expect(ctx.response.body instanceof Buffer).to.be.false;
    expect(ctx.response.body).to.be.null;
    expect(ctx.response.type).to.equal('');
  });
});

describe('serve', () => {
  const staticDir = `${process.cwd()}/test/assets`;

  it('should serve the file', async () => {
    const ctx = buildContext(
      '/assets/test.txt'
    );

    const fileServed = await serve({
      staticDir
    }, ctx);

    expect(fileServed).to.be.true;
    expect(ctx.response.body instanceof Buffer).to.be.true;
    expect(ctx.response.body.toString()).to.equal('test static file');
    expect(ctx.response.type).to.equal('text/plain');
  });

  it('should serve nothing if the route does not match', async () => {
    const ctx = buildContext(
      '/nothing/test.txt'
    );

    const fileServed = await serve({
      staticDir
    }, ctx);

    expect(fileServed).to.be.false;
    expect(ctx.response.body instanceof Buffer).to.be.false;
    expect(ctx.response.body).to.be.null;
    expect(ctx.response.type).to.equal('');
  });


  it('should return a Cache-Control header if maxAge is specified.', async () => {
    const ctx = buildContext(
      '/assets/test.txt'
    );

    await mwInvoke(
      serveFiles({
        staticDir: `${process.cwd()}/test/assets`,
        maxAge: 3600
      }),
      ctx
    );

    expect(ctx.response.body instanceof Buffer).to.be.true;
    expect(ctx.response.body.toString()).to.equal('test static file');
    expect(ctx.response.type).to.equal('text/plain');
    expect(ctx.response.headers.get('Cache-Control')).to.equal('max-age=3600');
  });
});
