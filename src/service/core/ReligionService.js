import { getRequest, postRequest } from '../apiRequest';

export class ReligionService {
    getReligions() {
        return getRequest('/religion/get');
    }
    createReligion(data) {
        return postRequest('/religion/make', data);
    }
    updateReligion(data) {
        return postRequest('/religion/update', data);
    }
    deleteReligion(id) {
        return postRequest('/religion/delete', { id: id });
    }
}
