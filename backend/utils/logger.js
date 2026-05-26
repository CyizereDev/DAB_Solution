import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (userId, action, entity, entityId, details, ipAddress) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entity,
      entityId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};