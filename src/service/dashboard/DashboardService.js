import { getRequest } from '../apiRequest';

export class DashboardService {
    getChartData() {
        return getRequest('/dashboard/getChartData');
    }
    getTotalStaff() {
        return getRequest('/dashboard/total-staff');
    }
    getTotalPlaces() {
        return getRequest('/dashboard/total-places');
    }
    getTotalPayouts() {
        return getRequest('/dashboard/total-payouts');
    }
    getTotalAdvances() {
        return getRequest('/dashboard/total-advances');
    }
    getAdvanceOverview() {
        return getRequest('/dashboard/advance-overview');
    }
    getKpiOverview() {
        return getRequest('/dashboard/kpi-overview');
    }
    getUpcomingBirthday() {
        return getRequest('/dashboard/upcoming-birthdays');
    }
}
