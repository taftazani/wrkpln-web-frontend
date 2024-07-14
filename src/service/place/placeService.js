import { getRequest, postRequest } from '../apiRequest';

export class PlaceService {
    getPlace() {
        return getRequest('/place/list');
    }

    createPlace(data) {
        return postRequest('/place/make', data);
    }

    updatePlace(data) {
        return postRequest('/place/update', data);
    }

    deletePlace(id) {
        return postRequest('/place/delete', { id: id });
    }
}
