import { prisma } from './prisma';
import { AuthUser, getAuthUser } from './auth';

export async function logAction(
  request: Request | null,
  options: {
    action: string;
    entity: string;
    entityId?: string | null;
    details?: Record<string, any> | string;
    user?: AuthUser | null;
  }
) {
  try {
    let userId: string | null = null;
    let userName = 'System';
    let userEmail = 'system@ganpatuniversity.ac.in';
    let clientIp = '127.0.0.1';
    let userAgent = 'Unknown';

    if (options.user) {
      userId = options.user.id;
      userName = options.user.name || options.user.username;
      userEmail = options.user.username;
      if (options.user.clientIp) clientIp = options.user.clientIp;
      if (options.user.userAgent) userAgent = options.user.userAgent;
    } else if (request) {
      const auth = await getAuthUser(request);
      if (auth.user) {
        userId = auth.user.id;
        userName = auth.user.name;
        userEmail = auth.user.username;
        clientIp = auth.user.clientIp || '127.0.0.1';
        userAgent = auth.user.userAgent || 'Unknown';
      }
    }

    const payload = typeof options.details === 'object'
      ? { ...options.details, ip: clientIp, userAgent, loggedAt: new Date().toISOString() }
      : { message: options.details, ip: clientIp, userAgent, loggedAt: new Date().toISOString() };

    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        userEmail,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId || null,
        details: JSON.stringify(payload),
      },
    });
  } catch (err) {
    console.error('[Audit Log Error]:', err);
  }
}
