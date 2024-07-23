import { getRequest, postRequest } from '../apiRequest';

export class FunctionService {
    getFunctions() {
        return getRequest('/function/get');
    }
    createFunction(data) {
        return postRequest('/function/make', data);
    }
    updateFunction(data) {
        return postRequest('/function/update', data);
    }
    deleteFunction(id) {
        return postRequest('/function/delete', { id: id });
    }
}
