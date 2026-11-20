import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * NextAuth v4's `getServerSession()` in the App Router (server components and
 * server actions) runs the `jwt` callback but can NOT write the updated
 * session cookie back to the browser. If refresh-token rotation ran there,
 * the database would revoke the old refresh token while the browser kept it,
 * and the user would be logged out on the next refresh.
 *
 * So server-side session reads are flagged "read-only" and the `jwt` callback
 * skips rotation for them. Rotation only happens in NextAuth's own
 * `/api/auth/session` route, which persists the new cookie.
 */
const sessionReadContext = new AsyncLocalStorage<{ readOnly: boolean }>();

export const runAsReadOnlySessionRead = <T>(fn: () => Promise<T>) =>
  sessionReadContext.run({ readOnly: true }, fn);

export const isReadOnlySessionRead = () =>
  sessionReadContext.getStore()?.readOnly === true;
