import { getRequest, postRequest } from '../apiRequest';

export class ScheduleService {
    getSchedule() {
        return getRequest('/schedule/list');
    }

    getUsers() {
        return getRequest('/user/list');
    }

    createSchedule(data) {
        return postRequest('/schedule/make', data);
    }

    updateSchedule(data) {
        return postRequest('/schedule/update', data);
    }

    deleteSchedule(id) {
        return postRequest('/schedule/delete', { id: id });
    }
}
