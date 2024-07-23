import { getRequest, postRequest } from '../apiRequest';

export class EmployeeTypeService {
    getEmployeeTypes() {
        return getRequest('/employee-types/get');
    }
    createEmployeeType(data) {
        return postRequest('/employee-types/make', data);
    }
    updateEmployeeType(data) {
        return postRequest('/employee-types/update', data);
    }
    deleteEmployeeType(id) {
        return postRequest('/employee-types/delete', { id: id });
    }
}
