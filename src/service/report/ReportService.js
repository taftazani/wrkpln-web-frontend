import { getRequest, postRequest } from '../apiRequest';

export class ReportService {
    getUser() {
        return getRequest('/user/list');
    }
    getReportAspects() {
        return getRequest('/report/aspects');
    }
    getReport(data) {
        return postRequest('/report/get', data);
    }

    createReport(data) {
        return postRequest('/report/make', data);
    }

    updateReportApprove(data) {
        return postRequest('/report/approve', data);
    }
    updateReportReject(data) {
        return postRequest('/report/reject', data);
    }

    deleteReport(id) {
        return postRequest('/report/delete', { id: id });
    }
}
