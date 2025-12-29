// env.d.ts or src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLOUDINARY_URL: string;
	readonly VITE_GRADIO_URL: string; // Define the types for your variables
	// more env variables...
  }
  
  interface ImportMeta {
	readonly env: ImportMetaEnv;
  }
