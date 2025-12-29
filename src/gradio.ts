import { Client, handle_file } from "@gradio/client";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { useLogStore } from "./logs";

// Define the type for the connected client
type GradioClient = Awaited<ReturnType<typeof Client.connect>>;

export const useFetchStore = defineStore('fetch', () => {

    // Gradio Public URL hosted from Kaggle. Mag utro-utro ni siya everytime i-run nako ang notebook.
    // Contact me if you need a different one.
    const url = ref("https://c025eac0bda433cf1e.gradio.live");
    const app: Ref<GradioClient | null> = ref(null);
    const addLog = useLogStore().addLog
    const ready = ref(false)
    const civilians = ref(0)
    const soldiers = ref(0)

    async function connectClient() {
        if (app.value === null) {
            app.value = await Client.connect(url.value);
            addLog('Connected to Gradio Space.', 'success');
            ready.value = true
        }
    }

    async function fetchData(file: File) {
        if (app.value === null) {
            // Safety check: Ensure the connection was made.
            addLog("Gradio client is not connected. Call connectClient() first.", 'warning');
            throw new Error("Gradio client is not connected. Call connectClient() first.");
        }
        // Submit the file to the Gradio app's predict endpoint
        addLog(`Video file is submitted for inference.`, 'info');
        const job = app.value.submit("/predict", {
            input_video_path: { "video": handle_file(file) },
        });

        for await (const message of job) {
            if (message.type === "data") {
                // Index 0 = Textbox (frame count)
                // Index 1 = Video (final file)

                const status = message.data[0] as string;
                const classes = message.data[1] as number;
                const video = message.data[2] as any;

                if (status) {
                    addLog(status, 'info'); // "Processed frames: 30", "60", etc.
                }

                if (classes) {
                    Number(classes) === 0 ? civilians.value++ : soldiers.value++;
                }

                if (video) {
                    const finalUrl = Array.isArray(video) ? video[0]?.video?.url : video?.video?.url;
                    addLog('Inference is complete.', 'success');
                    // This will only be truthy on the final yield
                    return finalUrl;
                }
            }
        }
    }

    return {
        connectClient,
        fetchData,
        ready,
        civilians,
        soldiers
    };

})