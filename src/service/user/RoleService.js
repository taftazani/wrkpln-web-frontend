import { getRequest, postRequest } from '../apiRequest';

export class RoleService {
    getRole() {
        return getRequest('/role/list');
    }
    getPermission() {
        return getRequest('/permission/list');
    }
    createRole(data) {
        return postRequest('/role/make', data);
    }

    updateRole(data) {
        return postRequest('/role/update', data);
    }

    deleteRole(id) {
        return postRequest('/role/delete', { id: id });
    }
}
