import { getRequest, postRequest } from '../apiRequest';

export class ShiftService {
    getShift() {
        return getRequest('/shift/list');
    }

    createShift(data) {
        return postRequest('/shift/make', data);
    }

    updateShift(data) {
        return postRequest('/shift/update', data);
    }

    deleteShift(id) {
        return postRequest('/shift/delete', { id: id });
    }
}
