import { BaseContext, Context, MemoryRequest, MemoryResponse, invokeMiddlewares, Middleware } from '@curveball/core';

export function buildContext(path: string): Context {

  const ctx = new BaseContext(
    new MemoryRequest('GET', path),
    new MemoryResponse()
  );

  return ctx;

}

export async function mwInvoke(mw: Middleware, ctx: Context): Promise<void> {

  await invokeMiddlewares(ctx, [mw]);

}
