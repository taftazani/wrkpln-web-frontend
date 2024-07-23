import { getRequest, postRequest } from '../apiRequest';

export class JenisAktifitasService {
    getJenisAktifitas() {
        return getRequest('/jenis-aktifitas/get');
    }

    createJenisAktifitas(data) {
        return postRequest('/jenis-aktifitas/make', data);
    }

    updateJenisAktifitas(data) {
        return postRequest('/jenis-aktifitas/update', data);
    }

    deleteJenisAktifitas(id) {
        return postRequest('/jenis-aktifitas/delete', { id });
    }

    exportJenisAktifitas() {
        return getRequest('/jenis-aktifitas/export');
    }

    bulkUploadJenisAktifitas(data) {
        return postRequest('/jenis-aktifitas/bulk-upload', data);
    }

    getBulkUploadDetails(id) {
        return getRequest(`/jenis-aktifitas/bulk-upload/${id}/details`);
    }
    bulkUpload(data) {
        return postRequest('/jenis-aktifitas/bulk-upload', data);
    }

    export() {
        return getRequest('/jenis-aktifitas/export', { responseType: 'blob' });
    }
}
