import { getRequest, postRequest } from '../apiRequest';

export class PackageTypeService {
    getPackageTypes() {
        return getRequest('/package-types/get');
    }
    createPackageType(data) {
        return postRequest('/package-types/make', data);
    }
    updatePackageType(data) {
        return postRequest('/package-types/update', data);
    }
    deletePackageType(id) {
        return postRequest('/package-types/delete', { id: id });
    }
}
