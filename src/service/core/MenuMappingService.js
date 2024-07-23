import { getRequest, postRequest } from '../apiRequest';

export class MenuMappingService {
    getMenuMappings() {
        return getRequest('/menuMapping/get');
    }
    createMenuMapping(data) {
        return postRequest('/menuMapping/make', data);
    }
    updateMenuMapping(data) {
        return postRequest('/menuMapping/update', data);
    }
    deleteMenuMapping(id) {
        return postRequest('/menuMapping/delete', { id: id });
    }
}
