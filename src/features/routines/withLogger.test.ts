import { describe, expect, it, vi } from 'vitest';
import { withLogger } from './withLogger';

describe('withLogger', () => {
  it('trả kết quả reducer gốc và không ghi log khi không ở môi trường DEV', () => {
    vi.stubEnv('DEV', false);
    const reducer = vi.fn((state: number, action: { type: string }) =>
      action.type === 'increment' ? state + 1 : state,
    );
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const loggedReducer = withLogger(reducer);

    expect(loggedReducer(1, { type: 'increment' })).toBe(2);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(log).not.toHaveBeenCalled();

    log.mockRestore();
    vi.unstubAllEnvs();
  });
});
