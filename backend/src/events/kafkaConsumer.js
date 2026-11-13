const AuditLog = require('../models/AuditLog');

/**
 * Handles incoming Kafka streams to store persistent audit logs
 */
const handleKafkaStreamMessage = async (payload) => {
  try {
    if (payload.action && payload.resource) {
      await AuditLog.create({
        userId: payload.userId,
        userEmail: payload.userEmail || 'system@hyperscale.internal',
        role: payload.role || 'System',
        action: payload.action,
        resource: payload.resource,
        resourceId: payload.resourceId,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        details: payload.details || {},
      });
    }
  } catch (error) {
    console.warn(`[Kafka Stream Log Warning]: ${error.message}`);
  }
};

module.exports = {
  handleKafkaStreamMessage,
};

