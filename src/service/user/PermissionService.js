import { getRequest, postRequest } from '../apiRequest';

export class PermissionService {
    getPermission() {
        return getRequest('/permission/list');
    }
    createPermission(data) {
        return postRequest('/permission/make', data);
    }

    updatePermission(data) {
        return postRequest('/permission/update', data);
    }

    deletePermission(id) {
        return postRequest('/permission/delete', { id: id });
    }
}
