import { notFound, redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { requireAdmin } from './server-actions/action-guard';
import { getServerSideSession } from './next-auth.util';

/**
 * Gate for admin-only *pages*. Call at the top of each admin page (not only
 * in a layout — layouts and pages render in parallel, so a layout check
 * doesn't stop the page's own data fetching).
 *
 * Signed out → login. Signed in but not an admin → 404, so the route's
 * existence isn't advertised. The role is re-read from the database.
 */
export async function requireAdminPage() {
  const session = await getServerSideSession();
  if (!session?.user?.id) redirect(PAGE_ROUTES.login);

  try {
    return await requireAdmin();
  } catch {
    notFound();
  }
}
