import { getRequest, postRequest } from '../apiRequest';

export class MarriedStatusService {
    getMarriedStatuses() {
        return getRequest('/marriedStatus/get');
    }
    createMarriedStatus(data) {
        return postRequest('/marriedStatus/make', data);
    }
    updateMarriedStatus(data) {
        return postRequest('/marriedStatus/update', data);
    }
    deleteMarriedStatus(id) {
        return postRequest('/marriedStatus/delete', { id: id });
    }
}
