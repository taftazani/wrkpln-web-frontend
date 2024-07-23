import { getRequest, postRequest } from '../apiRequest';

export class CitizenService {
    getCitizens() {
        return getRequest('/citizen/get');
    }
    createCitizen(data) {
        return postRequest('/citizen/make', data);
    }
    updateCitizen(data) {
        return postRequest('/citizen/update', data);
    }
    deleteCitizen(id) {
        return postRequest('/citizen/delete', { id: id });
    }
}
