import { getRequest, postRequest } from '../apiRequest';

export class KpiService {
    getUser() {
        return getRequest('/user/list');
    }
    getKpiAspects() {
        return getRequest('/kpi/aspects');
    }
    getKpi(data) {
        return postRequest('/kpi', data);
    }

    createKpi(data) {
        return postRequest('/kpi/make', data);
    }

    updateKpiApprove(data) {
        return postRequest('/kpi/approve', data);
    }
    updateKpiReject(data) {
        return postRequest('/kpi/reject', data);
    }

    deleteKpi(id) {
        return postRequest('/kpi/delete', { id: id });
    }
}
