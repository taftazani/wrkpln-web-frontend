import { getRequest, postRequest } from '../apiRequest';

export class IzinService {
    getIzin() {
        return getRequest('/izin/list');
    }

    createIzin(data) {
        return postRequest('/izin/make', data);
    }

    updateIzinApprove(data) {
        return postRequest('/izin/approve', data);
    }
    updateIzinReject(data) {
        return postRequest('/izin/reject', data);
    }

    deleteIzin(id) {
        return postRequest('/izin/delete', { id: id });
    }
}
