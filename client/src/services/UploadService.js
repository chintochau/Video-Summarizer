import axios from 'axios';

const cloudName = 'dsq31cpcf';



export default class UploadService {
    // upload service using cloudinary
    static uploadVideo = async (file, onProgress) => {
        const cloudName = 'dsq31cpcf';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'uploadmedia');
        return new Promise((resolve, reject) => {
            axios.post(url, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    onProgress(progress);
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}