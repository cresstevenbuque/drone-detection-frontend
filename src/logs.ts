import { defineStore } from "pinia";
import { ref, nextTick } from 'vue'

export const useLogStore = defineStore('log', () => {

    const logContainer = ref(null)
    const logs = ref([])
    
    // --- UTILITIES ---
    const addLog = (msg: string, type = 'info') => {
        const now = new Date()
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

        logs.value.push({ time: timeString, message: msg, type })

        // Auto scroll to bottom
        nextTick(() => {
            if (logContainer.value) {
                logContainer.value.scrollTop = logContainer.value.scrollHeight
            }
        })
    }

    function clearLog() {
        logs.value = []
    }

    return { logs, addLog, clearLog };
})