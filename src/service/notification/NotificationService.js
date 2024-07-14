import { getRequest, postRequest } from '../apiRequest';

export class NotificationService {
    getUser() {
        return getRequest('/user/list');
    }
    getNotification() {
        return getRequest('/notification/list');
    }
    createNotification(data) {
        return postRequest('/notification/make', data);
    }
    updateNotificationApprove(data) {
        return postRequest('/notification/update', data);
    }
    deleteNotification(data) {
        return postRequest('/notification/delete', { id: data });
    }
}
