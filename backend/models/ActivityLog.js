import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    enum: ['product', 'customer', 'sale', 'purchase', 'employee', 'user']
  },
  entityId: mongoose.Schema.Types.ObjectId,
  details: String,
  ipAddress: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ActivityLog', activityLogSchema);