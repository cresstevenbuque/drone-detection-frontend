<script setup>
    import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
    import { useFetchStore } from './gradio'
    import { cloud } from './upload'
    
    // --- STATE MANAGEMENT ---
    const isSystemActive = ref(false)
    const logs = ref([])
    const gradio = useFetchStore()
    const logContainer = ref(null)
    const mediaFile = ref(null)
    const mediaUrl = ref(null)
    const mediaType = ref('none') // 'video' or 'image'
    
    // Stats (Starts at zero, waiting for backend)
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
        if (isSystemActive.value) return 'ANALYZING STREAM'
        return 'STANDBY'
    })
    
    const systemStatusColor = computed(() => {
        if (!mediaFile.value) return 'text-red-500'
        if (isSystemActive.value) return 'text-emerald-400 shadow-emerald-400'
        return 'text-yellow-500'
    })
    
    // --- FILE UPLOAD HANDLING ---
    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
    
            // Determine if it is video or image
            if (file.type.startsWith('video/')) {
                mediaFile.value = file
                mediaUrl.value = URL.createObjectURL(file)
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
        const result = ref(null)
    
        if (!isSystemActive.value) {
            // System is activating (START)
            try {
                await cloud().run(mediaFile.value) // Upload file to Cloudinary
                console.log(cloud().result)
                result.value = await gradio.fetchData(cloud().result) // Send URL to Gradio for processing
                mediaUrl.value = result.value.data[0].video.url // Update the video interface with processed video URL
                console.log(result.value)
    
            } catch (error) {
                console.error("Error from Python:", error);
            }
            isSystemActive.value = true
            addLog('System Initialized. Analysis started.', 'success')
    
        } else {
            // System is terminating (CANCEL/STOP)
            isSystemActive.value = false
            addLog('System Terminated.', 'warning')
        }
    }
    
    // --- UTILITIES ---
    const addLog = (msg, type = 'info') => {
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
    
    const updateClock = () => {
        const now = new Date()
        currentTime.value = now.toLocaleTimeString()
    }
    
    // Lifecycle Hooks
    onMounted(() => {
        if (window.lucide) {
            window.lucide.createIcons()
        }
        updateClock()
        clockInterval = setInterval(updateClock, 1000)
        addLog('Frontend Interface Loaded.', 'info')
        addLog('Waiting for source input...', 'warning')
        gradio.connectClient()
    })
    
    onUnmounted(() => {
        clearInterval(clockInterval)
        if (mediaUrl.value) URL.revokeObjectURL(mediaUrl.value)
    })
    </script>
    
    <template>
        <div class="h-screen flex flex-col bg-slate-900 text-slate-200 antialiased overflow-hidden font-sans">
    
            <!-- HEADER -->
            <header class="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-20">
                <div class="flex items-center gap-3">
                    <div class="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/50">
                        <i data-lucide="crosshair" class="w-6 h-6 text-emerald-400"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-lg tracking-wide text-white">AERIAL THREAT DETECTION</h1>
                        <p class="text-xs text-slate-400 uppercase tracking-widest">System Prototype v1.0 • Ready for
                            Integration</p>
                    </div>
                </div>
    
                <div class="flex items-center gap-6">
                    <div class="flex flex-col text-right">
                        <span class="text-xs text-slate-500 uppercase">System Status</span>
                        <span class="text-sm font-mono font-bold" :class="systemStatusColor">{{ systemStatus }}</span>
                    </div>
                    <button @click="toggleSystem" :disabled="!mediaFile"
                        class="px-6 py-2 rounded font-bold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isSystemActive ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'">
                        <span v-if="!isSystemActive">INITIALIZE SYSTEM</span>
                        <span v-else>TERMINATE SCAN</span>
                    </button>
                </div>
            </header>
    
            <!-- MAIN LAYOUT -->
            <main class="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
    
                <!-- LEFT: VISUAL FEED (Col-span-9) -->
                <div
                    class="col-span-12 lg:col-span-9 relative bg-black flex items-center justify-center overflow-hidden group border-r border-slate-800">
    
                    <!-- 1. UPLOAD STATE (Visible when no file) -->
                    <div v-if="!mediaFile"
                        class="text-center p-10 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                        <i data-lucide="upload-cloud" class="w-16 h-16 text-slate-500 mx-auto mb-4"></i>
                        <h3 class="text-xl font-bold text-slate-400 mb-2">Upload Source Material</h3>
                        <p class="text-slate-500 text-sm mb-6">Select drone footage (MP4) or aerial imagery (JPG/PNG)</p>
    
                        <label
                            class="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition">
                            Browse Files
                            <input type="file" class="hidden" @change="handleFileUpload" accept="video/*,image/*">
                        </label>
                    </div>
    
                    <!-- 2. PREVIEW STATE (Visible when file loaded) -->
                    <div v-else class="relative w-full h-full flex items-center justify-center bg-gray-900">
    
                        <!-- Video Player -->
                        <video v-if="mediaType === 'video'" :src="mediaUrl" controls class="max-w-full max-h-full"
                            :autoplay="isSystemActive" :loop="isSystemActive"></video>
    
                        <!-- Image Viewer -->
                        <img v-if="mediaType === 'image'" :src="mediaUrl" class="max-w-full max-h-full object-contain">
    
                        <!-- HUD Overlay (Only shows when Active) -->
                        <div v-if="isSystemActive" class="absolute inset-0 hud-grid pointer-events-none">
                            <div class="scan-line"></div>
                            <div
                                class="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
                                PROCESSING • {{ currentTime }}
                            </div>
    
                            <!-- BACKEND TEAM: Insert v-for loop here for bounding boxes -->
                        </div>
                    </div>
    
                </div>
    
                <!-- RIGHT: ANALYTICS (Col-span-3) -->
                <div class="col-span-12 lg:col-span-3 bg-slate-900 flex flex-col h-full">
    
                    <!-- Stats -->
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
    
                    <!-- Logs -->
                    <div class="flex-1 flex flex-col overflow-hidden">
                        <div class="p-4 bg-slate-950 border-b border-slate-800">
                            <h3 class="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-emerald-500"
                                    :class="isSystemActive ? 'animate-pulse' : 'opacity-20'"></div>
                                System Logs
                            </h3>
                        </div>
                        <div ref="logContainer"
                            class="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 scrollbar-hide bg-black/20">
                            <div v-if="logs.length === 0" class="text-slate-600 italic text-center mt-10">
                                System ready. Initialize to begin logging.
                            </div>
                            <div v-for="(log, index) in logs" :key="index" class="border-l-2 pl-2"
                                :class="log.type === 'alert' ? 'border-red-500 text-red-200' : (log.type === 'success' ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-400')">
                                <span class="opacity-50 mr-2">[{{ log.time }}]</span>
                                <span>{{ log.message }}</span>
                            </div>
                        </div>
                    </div>
    
                    <!-- Footer -->
                    <div class="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-center text-slate-600">
                        AWAITING BACKEND CONNECTION
                    </div>
                </div>
            </main>
    
        </div>
    </template>
    
    <style scoped>
    .hud-grid {
        background-image:
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
    }
    
    .scan-line {
        width: 100%;
        height: 2px;
        background: rgba(0, 255, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        animation: scan 3s linear infinite;
        z-index: 10;
    }
    
    @keyframes scan {
        0% {
            top: 0%;
        }
    
        100% {
            top: 100%;
        }
    }
    
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    </style>