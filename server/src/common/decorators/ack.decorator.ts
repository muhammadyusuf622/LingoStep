import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ack = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    const ack = args[2];
    return typeof ack === 'function' ? ack : undefined;
  },
);
