import { postRequest, getRequest } from './apiRequest';

export class RegistrationService {
    registerCompany(data) {
        return postRequest('/register', data);
    }
    getPackages() {
        return getRequest('/get-packages');
    }
}
