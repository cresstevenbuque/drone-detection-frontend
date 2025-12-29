import { Client, handle_file } from "@gradio/client";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

// Define the type for the connected client
type GradioClient = Awaited<ReturnType<typeof Client.connect>>;

export const useFetchStore = defineStore('fetch', () => {

    // Gradio Public URL hosted from Kaggle. Mag utro-utro ni siya everytime i-run nako ang notebook.
    // Contact me if you need a different one.
    const url = ref("https://aeb47a345703b7e85c.gradio.live");
    const app: Ref<GradioClient | null> = ref(null);

    async function connectClient() {
        if (app.value === null) {
            app.value = await Client.connect(url.value);
            console.log(`Connected to Gradio Space`);
        }
    }

    async function fetchData(file: any) {
        if (app.value === null) {
            // Safety check: Ensure the connection was made.
            throw new Error("Gradio client is not connected. Call connectClient() first.");
        }
        // Submit the file to the Gradio app's predict endpoint
        const job = await app.value.predict("/predict", {
            input_video_path: {"video": handle_file(file)},
        });
        console.log("Job submitted:", job.data[0].video.url)
        return job;
    }

    return {
        connectClient,
        fetchData
    };

})