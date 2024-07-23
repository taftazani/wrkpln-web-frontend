import { getRequest, postRequest } from '../apiRequest';

export class StructureService {
    getStructures() {
        return getRequest('/structure/get');
    }
    createStructure(data) {
        return postRequest('/structure/make', data);
    }
    updateStructure(data) {
        return postRequest('/structure/update', data);
    }
    deleteStructure(id) {
        return postRequest('/structure/delete', { id: id });
    }
    reorderStructure(data) {
        return postRequest('/structure/reorder', data);
    }
    assignUserToStructure(data) {
        return postRequest('/structure/assign-user', data);
    }
    removeUserFromStructure(data) {
        return postRequest('/structure/remove-user', data);
    }
}
