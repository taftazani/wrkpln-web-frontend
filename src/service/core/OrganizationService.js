import { getRequest, postRequest } from '../apiRequest';

export class OrganizationService {
    getOrganizations() {
        return getRequest('/organization/get');
    }
    createOrganization(data) {
        return postRequest('/organization/make', data);
    }
    updateOrganization(data) {
        return postRequest('/organization/update', data);
    }
    deleteOrganization(id) {
        return postRequest('/organization/delete', { id: id });
    }
}
