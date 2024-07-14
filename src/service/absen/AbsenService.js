import { getRequest, postRequest } from '../apiRequest';

export class AbsenService {
    getAbsen() {
        return getRequest('/absen/list');
    }

    createAbsen(data) {
        return postRequest('/absen/make', data);
    }

    deleteAbsen(id) {
        return postRequest('/absen/delete', { id: id });
    }
}
