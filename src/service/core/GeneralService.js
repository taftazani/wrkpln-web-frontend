import { getRequest, postRequest } from '../apiRequest';

export class GeneralService {
    getSettings() {
        return getRequest('/settings/get');
    }

    updateLoginTimeout(data) {
        return postRequest('/settings/login-timeout', data);
    }

    updateWorkday(id, data) {
        return postRequest(`/settings/workday/${id}`, data);
    }
}
