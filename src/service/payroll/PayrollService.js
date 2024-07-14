import { getRequest, postRequest } from '../apiRequest';

export class PayrollService {
    getUser() {
        return getRequest('/user/list');
    }
    getPayroll(data) {
        return postRequest('/payroll/list', data);
    }

    createPayroll(data) {
        return postRequest('/payroll/make', data);
    }

    updatePayrollBulk(data) {
        return postRequest('/payroll/update/bulk', data);
    }

    updatePayrollOne(data) {
        return postRequest('/payroll/update/one', data);
    }
    updatePayrollReject(data) {
        return postRequest('/payroll/reject', data);
    }

    deletePayroll(id) {
        return postRequest('/payroll/delete', { id: id });
    }
}
