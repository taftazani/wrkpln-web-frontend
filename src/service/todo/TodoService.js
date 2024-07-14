import { getRequest, postRequest } from '../apiRequest';

export class TodoService {
    getUser() {
        return getRequest('/user/list');
    }
    getTodoAspects() {
        return getRequest('/todo/aspects');
    }
    getTodo() {
        return getRequest('/todo/list');
    }

    createTodo(data) {
        return postRequest('/todo/make', data);
    }

    updateTodoApprove(data) {
        return postRequest('/todo/approve', data);
    }
    updateTodoReject(data) {
        return postRequest('/todo/reject', data);
    }

    deleteTodo(id) {
        return postRequest('/todo/delete', { id: id });
    }
}
