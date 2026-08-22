import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async ({
  actorId,
  actorName,
  actorRole = 'Employee',
  action,
  entity,
  entityId,
  metadata = {},
  req = null
}) => {
  try {
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || null;
    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Dayflow Audit Error]', err.message);
  }
};
