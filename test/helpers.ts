import { Context, MemoryRequest, MemoryResponse, invokeMiddlewares, Middleware } from '@curveball/kernel';

export function buildContext(path: string): Context {

  const ctx = new Context(
    new MemoryRequest('GET', path, 'http://localhost'),
    new MemoryResponse('http://localhost')
  );

  return ctx;

}

export async function mwInvoke(mw: Middleware, ctx: Context): Promise<void> {

  await invokeMiddlewares(ctx, [mw]);

}
