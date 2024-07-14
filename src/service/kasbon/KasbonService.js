import { getRequest, postRequest } from '../apiRequest';

export class KasbonService {
    getKasbon() {
        return getRequest('/kasbon/list');
    }

    createKasbon(data) {
        return postRequest('/kasbon/make', data);
    }

    updateKasbonApprove(data) {
        return postRequest('/kasbon/approve', data);
    }
    updateKasbonReject(data) {
        return postRequest('/kasbon/reject', data);
    }

    deleteKasbon(id) {
        return postRequest('/kasbon/delete', { id: id });
    }
}
