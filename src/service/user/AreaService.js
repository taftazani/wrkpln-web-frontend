import { getRequest, postRequest } from '../apiRequest';

export class AreaService {
    getUser() {
        return getRequest('/user/list');
    }
    getArea() {
        return getRequest('/place/list');
    }
    createArea(data) {
        return postRequest('/user/make/area', data);
    }
    updateArea(data) {
        return postRequest('/user/update/area', data);
    }

    deleteArea(id) {
        return postRequest('/user/remove/area', data);
    }
}
