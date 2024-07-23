import { getRequest, postRequest } from '../apiRequest';

export class GenderService {
    getGenders() {
        return getRequest('/gender/get');
    }
    createGender(data) {
        return postRequest('/gender/make', data);
    }
    updateGender(data) {
        return postRequest('/gender/update', data);
    }
    deleteGender(id) {
        return postRequest('/gender/delete', { id: id });
    }
}
