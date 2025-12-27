<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// --- STATE MANAGEMENT ---
const isSystemActive = ref(false)
const isProcessing = ref(false) // State for the loading bar
const logs = ref([])
const logContainer = ref(null)
const mediaFile = ref(null)
const mediaUrl = ref(null)
const mediaType = ref('none')

// Stats
const stats = ref({
  soldiers: 0,
  civilians: 0
})

// Timer for the clock
let clockInterval = null
const currentTime = ref('')

// Computed Properties for UI
const systemStatus = computed(() => {
    if (!mediaFile.value) return 'NO SOURCE'
    if (isProcessing.value) return 'INITIALIZING...'
    if (isSystemActive.value) return 'ANALYZING STREAM'
    return 'STANDBY'
})

const systemStatusColor = computed(() => {
    if (!mediaFile.value) return 'text-red-500'
    if (isProcessing.value) return 'text-yellow-400 animate-pulse'
    if (isSystemActive.value) return 'text-emerald-400 shadow-emerald-400'
    return 'text-yellow-500'
})

// --- FILE UPLOAD HANDLING ---
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        mediaFile.value = file
        mediaUrl.value = URL.createObjectURL(file)
        
        if (file.type.startsWith('video/')) {
            mediaType.value = 'video'
            addLog(`Video Source Loaded: ${file.name}`, 'info')
        } else if (file.type.startsWith('image/')) {
            mediaType.value = 'image'
            addLog(`Static Imagery Loaded: ${file.name}`, 'info')
        }
    }
}

// --- SYSTEM CONTROLS ---
const toggleSystem = async () => {
    if (!mediaFile.value) {
        alert("Please upload a video or image source first.")
        return
    }

    if(!isSystemActive.value) {
        // START INITIALIZATION
        isProcessing.value = true
        addLog('Connecting to AI Backend Processor...', 'info')

        // Simulate 1.5 seconds loading for the progress bar
        await new Promise(resolve => setTimeout(resolve, 1500))

        isProcessing.value = false
        isSystemActive.value = true
        addLog('System Initialized. Analysis started.', 'success')
        
    } else {
        // TERMINATE SCAN
        isSystemActive.value = false
        isProcessing.value = false
        addLog('System Terminated by User.', 'alert')
    }
}

// --- UTILITIES ---
const addLog = (msg, type = 'info') => {
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  
  logs.value.push({ time: timeString, message: msg, type })
  
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

onMounted(() => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons()
  }
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  addLog('Frontend Interface Loaded.', 'info')
  addLog('Waiting for source input...', 'warning')
})

onUnmounted(() => {
  clearInterval(clockInterval)
  if (mediaUrl.value) URL.revokeObjectURL(mediaUrl.value)
})
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-900 text-slate-200 antialiased overflow-hidden font-sans relative">

    <header class="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-20">
        <div class="flex items-center gap-3">
            <div class="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/50">
                <i data-lucide="crosshair" class="w-6 h-6 text-emerald-400"></i>
            </div>
            <div>
                <h1 class="font-bold text-lg tracking-wide text-white uppercase">Aerial Threat Detection</h1>
                <p class="text-xs text-slate-400 uppercase tracking-widest">System Prototype v1.0 • Ready for Integration</p>
            </div>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex flex-col text-right">
                <span class="text-xs text-slate-500 uppercase">System Status</span>
                <span class="text-sm font-mono font-bold" :class="systemStatusColor">{{ systemStatus }}</span>
            </div>
            <button 
                @click="toggleSystem"
                :disabled="!mediaFile || isProcessing"
                class="px-6 py-2 rounded font-bold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
                :class="isSystemActive ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'"
            >
                <span v-if="isProcessing" class="flex items-center gap-2">
                   <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CONNECTING...
                </span>
                <span v-else-if="!isSystemActive">INITIALIZE SYSTEM</span>
                <span v-else>DISABLE SCAN</span>
            </button>
        </div>
    </header>

    <main class="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        <div class="col-span-12 lg:col-span-9 relative bg-black flex items-center justify-center overflow-hidden border-r border-slate-800">
            
            <div v-if="!mediaFile" class="text-center p-10 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                <i data-lucide="upload-cloud" class="w-16 h-16 text-slate-500 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-slate-400 mb-2">Upload Source Material</h3>
                <p class="text-slate-500 text-sm mb-6">Select drone footage (MP4) or aerial imagery (JPG/PNG)</p>
                <label class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition inline-block">
                    Browse Files
                    <input type="file" class="hidden" @change="handleFileUpload" accept="video/*,image/*">
                </label>
            </div>

            <div v-else class="relative w-full h-full flex items-center justify-center bg-gray-900">
                <video v-if="mediaType === 'video'" :src="mediaUrl" controls class="max-w-full max-h-full" :autoplay="isSystemActive"></video>
                <img v-if="mediaType === 'image'" :src="mediaUrl" class="max-w-full max-h-full object-contain">

                <div v-if="isProcessing" class="absolute inset-0 z-40 bg-slate-950/90 flex flex-col items-center justify-center font-mono">
                    <div class="w-full max-w-md px-10">
                        <div class="flex justify-between mb-2">
                            <span class="text-emerald-500 text-[10px] tracking-[0.3em] animate-pulse">ESTABLISHING LINK...</span>
                            <span class="text-emerald-500 text-[10px]">SYNCING</span>
                        </div>
                        <div class="w-full h-2 bg-slate-900 border border-emerald-500/30 p-[1px]">
                            <div class="h-full bg-emerald-500 loading-bar-progress"></div>
                        </div>
                        <p class="text-slate-500 text-[9px] mt-4 text-center uppercase tracking-widest">
                            Neural Processing Engine Initializing
                        </p>
                    </div>
                </div>

                <div v-if="isSystemActive && !isProcessing" class="absolute inset-0 hud-grid pointer-events-none">
                    <div class="scan-line"></div>
                    <div class="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
                        ANALYZING FEED • {{ currentTime }}
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-3 bg-slate-900 flex flex-col h-full border-l border-slate-800">
            <div class="p-6 border-b border-slate-800">
                <h2 class="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Detection Analytics</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-800/50 p-4 rounded border border-red-500/20 text-center">
                        <div class="text-red-500 text-xs uppercase font-bold mb-1">Threats</div>
                        <div class="text-3xl font-mono font-bold text-white">{{ stats.soldiers }}</div>
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded border border-blue-500/20 text-center">
                        <div class="text-blue-400 text-xs uppercase font-bold mb-1">Civilians</div>
                        <div class="text-3xl font-mono font-bold text-white">{{ stats.civilians }}</div>
                    </div>
                </div>
            </div>

            <div class="flex-1 flex flex-col overflow-hidden">
                <div class="p-4 bg-slate-950 border-b border-slate-800">
                    <h3 class="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-emerald-500" :class="isSystemActive ? 'animate-pulse' : 'opacity-20'"></div>
                        System Logs
                    </h3>
                </div>
                <div ref="logContainer" class="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 bg-black/20 scroll-smooth">
                    <div v-if="logs.length === 0" class="text-slate-600 italic text-center mt-10">
                        Awaiting system initialization...
                    </div>
                    <div v-for="(log, index) in logs" :key="index" class="border-l-2 pl-2" :class="log.type === 'alert' ? 'border-red-500 text-red-400' : (log.type === 'success' ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400')">
                        <span class="opacity-50 mr-2">[{{ log.time }}]</span>
                        <span>{{ log.message }}</span>
                    </div>
                </div>
            </div>
            
            <div class="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-center text-slate-600 tracking-widest">
                {{ isSystemActive ? 'ENCRYPTED DATA LINK ACTIVE' : 'AWAITING BACKEND CONNECTION' }}
            </div>
        </div>
    </main>
  </div>
</template>

<style scoped>
.hud-grid {
    background-image: 
        linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
}

.scan-line {
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.5), transparent);
    position: absolute;
    top: 0;
    left: 0;
    animation: scan 4s linear infinite;
    z-index: 10;
}

.loading-bar-progress {
    width: 0%;
    animation: fillBar 1.5s ease-in-out forwards;
}

@keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
}

@keyframes fillBar {
    0% { width: 0%; }
    30% { width: 40%; }
    70% { width: 90%; }
    100% { width: 100%; }
}

::-webkit-scrollbar {
    width: 4px;
}
::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.1);
}
::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 10px;
}
</style>