import {ref} from "vue";
import { defineStore } from "pinia";

export const cloud = defineStore('upload', () => {

    const result = ref(null); 

    async function run(file) {
        try {
            const url = `https://api.cloudinary.com/v1_1/dsf58gpmf/upload`; // Name of my Cloudinary space
            const fd = new FormData();
            fd.append('upload_preset', 'uploaded_videos'); // Name of my upload preset
            fd.append('file', file);

            await fetch(url, {
                method: 'POST',
                body: fd,
            })
            .then((response) => response.json())
            .then((data) => {
                // File uploaded successfully
                result.value = data.secure_url;
            })
            
        } catch (e) {
            console.error(e);
        }
    }
    return { result, run }
});