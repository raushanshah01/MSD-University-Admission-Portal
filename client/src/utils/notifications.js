// Browser notification utility

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  }
};

// Show notification for application status updates
export const notifyApplicationStatus = (status, applicationId) => {
  const messages = {
    submitted: 'Your application has been submitted successfully!',
    under_review: 'Your application is now under review',
    approved: '🎉 Congratulations! Your application has been approved!',
    rejected: 'Your application status has been updated',
    pending: 'Your application is pending review'
  };

  const message = messages[status] || 'Application status updated';

  showNotification('Application Update', {
    body: message,
    tag: `app-${applicationId}`,
    requireInteraction: status === 'approved',
    onClick: () => {
      window.location.href = '/applicant/applications';
    }
  });
};

// Show notification for new announcements
export const notifyNewAnnouncement = (title, message) => {
  showNotification('New Announcement', {
    body: `${title}\n${message.substring(0, 100)}...`,
    tag: 'announcement',
    onClick: () => {
      window.location.href = '/applicant';
    }
  });
};
