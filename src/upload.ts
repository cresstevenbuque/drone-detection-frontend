import {ref} from "vue";
import { defineStore } from "pinia";
import { useLogStore } from "./logs";

export const cloud = defineStore('upload', () => {

    const result = ref(null); 
    const addLog = useLogStore().addLog

    async function run(file: File) {
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
                addLog("Video file successfully uploaded to the server.", 'success')
            })
            
        } catch (e) {
            console.error(e);
        }
    }
    return { result, run }
});