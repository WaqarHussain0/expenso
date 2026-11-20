'use server';

import { revalidatePath } from 'next/cache';
import { AiKeysService } from '@/backend/modules/ai-keys/ai-keys.service';
import {
  AiProviderEnum,
  IAiKeySummary,
} from '@/app/constants/ai-providers.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { getServerSideSession } from '../next-auth.util';

const aiKeysService = new AiKeysService();

interface ActionResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

/** The signed-in user's id, taken from the session — never from the caller. */
async function requireUserId(): Promise<string> {
  const session = await getServerSideSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('You need to be signed in.');
  return userId;
}

const isProvider = (value: unknown): value is AiProviderEnum =>
  Object.values(AiProviderEnum).includes(value as AiProviderEnum);

export async function getMyAiKeysAction(): Promise<
  ActionResult<IAiKeySummary[]>
> {
  try {
    const userId = await requireUserId();
    return { success: true, data: await aiKeysService.listForUser(userId) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function saveMyAiKeyAction(
  provider: AiProviderEnum,
  apiKey: string,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    if (!isProvider(provider)) throw new Error('Unknown provider');

    await aiKeysService.save(userId, provider, apiKey);

    revalidatePath(PAGE_ROUTES.profile);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteMyAiKeyAction(
  provider: AiProviderEnum,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    if (!isProvider(provider)) throw new Error('Unknown provider');

    await aiKeysService.remove(userId, provider);

    revalidatePath(PAGE_ROUTES.profile);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
