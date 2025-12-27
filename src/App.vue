<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// --- STATE MANAGEMENT ---
const isSystemActive = ref(false)
<<<<<<< HEAD
const isProcessing = ref(false) // State for the loading bar
=======
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
const logs = ref([])
const logContainer = ref(null)
const mediaFile = ref(null)
const mediaUrl = ref(null)
<<<<<<< HEAD
const mediaType = ref('none')

// Stats
=======
const mediaType = ref('none') // 'video' or 'image'

// Stats (Starts at zero, waiting for backend)
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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
<<<<<<< HEAD
    if (isProcessing.value) return 'INITIALIZING...'
=======
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
    if (isSystemActive.value) return 'ANALYZING STREAM'
    return 'STANDBY'
})

const systemStatusColor = computed(() => {
    if (!mediaFile.value) return 'text-red-500'
<<<<<<< HEAD
    if (isProcessing.value) return 'text-yellow-400 animate-pulse'
=======
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
    if (isSystemActive.value) return 'text-emerald-400 shadow-emerald-400'
    return 'text-yellow-500'
})

// --- FILE UPLOAD HANDLING ---
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        mediaFile.value = file
        mediaUrl.value = URL.createObjectURL(file)
        
<<<<<<< HEAD
=======
        // Determine if it is video or image
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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
<<<<<<< HEAD
const toggleSystem = async () => {
=======
const toggleSystem = () => {
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
    if (!mediaFile.value) {
        alert("Please upload a video or image source first.")
        return
    }

<<<<<<< HEAD
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
=======
    isSystemActive.value = !isSystemActive.value

    if(isSystemActive.value) {
        addLog('System Initialized. Analysis started.', 'success')
        
        // BACKEND TEAM: Put your WebSocket or API connection code here!
        // Example: connectToPythonBackend();
        
    } else {
        addLog('System Terminated.', 'warning')
        // BACKEND TEAM: Disconnect code goes here
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
    }
}

// --- UTILITIES ---
const addLog = (msg, type = 'info') => {
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  
  logs.value.push({ time: timeString, message: msg, type })
  
<<<<<<< HEAD
=======
  // Auto scroll to bottom
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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

<<<<<<< HEAD
onMounted(() => {
  // Initialize Lucide icons if available
=======
// Lifecycle Hooks
onMounted(() => {
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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
<<<<<<< HEAD
  <div class="h-screen flex flex-col bg-slate-900 text-slate-200 antialiased overflow-hidden font-sans relative">

=======
  <div class="h-screen flex flex-col bg-slate-900 text-slate-200 antialiased overflow-hidden font-sans">

    <!-- HEADER -->
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
    <header class="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-20">
        <div class="flex items-center gap-3">
            <div class="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/50">
                <i data-lucide="crosshair" class="w-6 h-6 text-emerald-400"></i>
            </div>
            <div>
<<<<<<< HEAD
                <h1 class="font-bold text-lg tracking-wide text-white uppercase">Aerial Threat Detection</h1>
=======
                <h1 class="font-bold text-lg tracking-wide text-white">AERIAL THREAT DETECTION</h1>
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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
<<<<<<< HEAD
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
=======
                :disabled="!mediaFile"
                class="px-6 py-2 rounded font-bold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isSystemActive ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'"
            >
                <span v-if="!isSystemActive">INITIALIZE SYSTEM</span>
                <span v-else>TERMINATE SCAN</span>
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
            </button>
        </div>
    </header>

<<<<<<< HEAD
    <main class="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        <div class="col-span-12 lg:col-span-9 relative bg-black flex items-center justify-center overflow-hidden border-r border-slate-800">
            
=======
    <!-- MAIN LAYOUT -->
    <main class="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        <!-- LEFT: VISUAL FEED (Col-span-9) -->
        <div class="col-span-12 lg:col-span-9 relative bg-black flex items-center justify-center overflow-hidden group border-r border-slate-800">
            
            <!-- 1. UPLOAD STATE (Visible when no file) -->
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
            <div v-if="!mediaFile" class="text-center p-10 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                <i data-lucide="upload-cloud" class="w-16 h-16 text-slate-500 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-slate-400 mb-2">Upload Source Material</h3>
                <p class="text-slate-500 text-sm mb-6">Select drone footage (MP4) or aerial imagery (JPG/PNG)</p>
<<<<<<< HEAD
                <label class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition inline-block">
=======
                
                <label class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition">
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
                    Browse Files
                    <input type="file" class="hidden" @change="handleFileUpload" accept="video/*,image/*">
                </label>
            </div>

<<<<<<< HEAD
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
=======
            <!-- 2. PREVIEW STATE (Visible when file loaded) -->
            <div v-else class="relative w-full h-full flex items-center justify-center bg-gray-900">
                
                <!-- Video Player -->
                <video v-if="mediaType === 'video'" :src="mediaUrl" controls class="max-w-full max-h-full" :autoplay="isSystemActive" :loop="isSystemActive"></video>
                
                <!-- Image Viewer -->
                <img v-if="mediaType === 'image'" :src="mediaUrl" class="max-w-full max-h-full object-contain">

                <!-- HUD Overlay (Only shows when Active) -->
                <div v-if="isSystemActive" class="absolute inset-0 hud-grid pointer-events-none">
                    <div class="scan-line"></div>
                    <div class="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
                        PROCESSING • {{ currentTime }}
                    </div>
                    
                    <!-- BACKEND TEAM: Insert v-for loop here for bounding boxes -->
                </div>
            </div>

        </div>

        <!-- RIGHT: ANALYTICS (Col-span-3) -->
        <div class="col-span-12 lg:col-span-3 bg-slate-900 flex flex-col h-full">
            
            <!-- Stats -->
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
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

<<<<<<< HEAD
=======
            <!-- Logs -->
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
            <div class="flex-1 flex flex-col overflow-hidden">
                <div class="p-4 bg-slate-950 border-b border-slate-800">
                    <h3 class="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-emerald-500" :class="isSystemActive ? 'animate-pulse' : 'opacity-20'"></div>
                        System Logs
                    </h3>
                </div>
<<<<<<< HEAD
                <div ref="logContainer" class="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 bg-black/20 scroll-smooth">
                    <div v-if="logs.length === 0" class="text-slate-600 italic text-center mt-10">
                        Awaiting system initialization...
                    </div>
                    <div v-for="(log, index) in logs" :key="index" class="border-l-2 pl-2" :class="log.type === 'alert' ? 'border-red-500 text-red-400' : (log.type === 'success' ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400')">
=======
                <div ref="logContainer" class="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 scrollbar-hide bg-black/20">
                    <div v-if="logs.length === 0" class="text-slate-600 italic text-center mt-10">
                        System ready. Initialize to begin logging.
                    </div>
                    <div v-for="(log, index) in logs" :key="index" class="border-l-2 pl-2" :class="log.type === 'alert' ? 'border-red-500 text-red-200' : (log.type === 'success' ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-400')">
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
                        <span class="opacity-50 mr-2">[{{ log.time }}]</span>
                        <span>{{ log.message }}</span>
                    </div>
                </div>
            </div>
            
<<<<<<< HEAD
            <div class="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-center text-slate-600 tracking-widest">
                {{ isSystemActive ? 'ENCRYPTED DATA LINK ACTIVE' : 'AWAITING BACKEND CONNECTION' }}
            </div>
        </div>
    </main>
=======
            <!-- Footer -->
            <div class="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-center text-slate-600">
                AWAITING BACKEND CONNECTION
            </div>
        </div>
    </main>

>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
  </div>
</template>

<style scoped>
.hud-grid {
    background-image: 
<<<<<<< HEAD
        linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
=======
        linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
}

.scan-line {
    width: 100%;
    height: 2px;
<<<<<<< HEAD
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

=======
    background: rgba(0, 255, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    animation: scan 3s linear infinite;
    z-index: 10;
}

>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
@keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
}

<<<<<<< HEAD
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
=======
.scrollbar-hide::-webkit-scrollbar {
    display: none;
>>>>>>> b6556c49e6b9e99dee4f4d6bd069d081a722eead
}
</style>