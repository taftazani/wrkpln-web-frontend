import { getRequest, postRequest } from '../apiRequest';

export class HolidayService {
    getHolidays() {
        return getRequest('/holidays/get');
    }
    createHoliday(data) {
        return postRequest('/holidays/make', data);
    }
    updateHoliday(data) {
        return postRequest('/holidays/update', data);
    }
    deleteHoliday(id) {
        return postRequest('/holidays/delete', { id: id });
    }
}
