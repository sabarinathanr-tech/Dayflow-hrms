import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const isHR = req.user.role === 'HR' || req.user.role === 'Admin';

    const filter = {
      $or: [
        { userId: employeeId },
        { userId: null },
        ...(isHR ? [{ userId: 'HR-001' }] : [])
      ]
    };

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: notif
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const isHR = req.user.role === 'HR' || req.user.role === 'Admin';

    const filter = {
      $or: [
        { userId: employeeId },
        { userId: null },
        ...(isHR ? [{ userId: 'HR-001' }] : [])
      ]
    };

    await Notification.updateMany(filter, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
};
