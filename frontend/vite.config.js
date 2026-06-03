import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyAssetsPlugin() {
  return {
    name: 'copy-assets-plugin',
    buildStart() {
      try {
        const rootDir = process.cwd();
        const srcLogo = path.join(rootDir, '..', 'Assests', 'Logo.png');
        const srcLogoTitle = path.join(rootDir, '..', 'Assests', 'Logo with title.png');
        const destDir = path.join(rootDir, 'public');
        const destLogo = path.join(destDir, 'logo.png');
        const destLogoTitle = path.join(destDir, 'logo-title.png');

        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        if (fs.existsSync(srcLogo)) {
          fs.copyFileSync(srcLogo, destLogo);
        }

        if (fs.existsSync(srcLogoTitle)) {
          fs.copyFileSync(srcLogoTitle, destLogoTitle);
        }
      } catch (err) {
        console.error('Failed to copy assets in Vite plugin:', err);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyAssetsPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
