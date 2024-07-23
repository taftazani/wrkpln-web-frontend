import { getRequest, postRequest } from '../apiRequest';

export class LevelStructureService {
    getLevelStructures() {
        return getRequest('/levelStructure/get');
    }
    createLevelStructure(data) {
        return postRequest('/levelStructure/make', data);
    }
    updateLevelStructure(data) {
        return postRequest('/levelStructure/update', data);
    }
    deleteLevelStructure(id) {
        return postRequest('/levelStructure/delete', { id: id });
    }
}
