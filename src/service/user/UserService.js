import { getRequest, postRequest } from '../apiRequest';

export class UserService {
    getUser() {
        return getRequest('/user/list');
    }
    getRole() {
        return getRequest('/user/get/role');
    }
    createUser(data) {
        return postRequest('/user/make', data);
    }

    updateUser(data) {
        return postRequest('/user/update/admin', data);
    }

    deleteUser(id) {
        return postRequest('/user/delete', { id: id });
    }
}
