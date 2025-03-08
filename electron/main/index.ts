//index.ts

import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs';
import cors from "cors"
import express from "express"
import authRoutes from './server/routes/auth';
import noteRoutes from './server/routes/note';
import boardRoutes from './server/routes/boards';
import botRoutes from './server/routes/bots';
import { update } from './update'

const __filename = path.dirname(fileURLToPath(import.meta.url))
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

process.env.APP_ROOT = path.join(__filename, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__filename, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
  // **開発環境か本番環境かを判定**
  ipcMain.handle("get-pdf-worker-path", () => {
    const isDev = !app.isPackaged;
    let workerPath: string;

    if (isDev) {
      // In development, look in the public folder of the project
      workerPath = path.join(__dirname, "../public/pdf.worker.min.mjs");
      console.log("86",workerPath)
    } else {
      // In production, look in the resources folder
      workerPath = path.join(process.resourcesPath, "resources", "pdf.worker.min.mjs");
      console.log("90",workerPath)
    }
    // Verify the worker path exists
    if (!fs.existsSync(workerPath)) {
      console.error(`PDF worker not found at: ${workerPath}`);
      // Fallback to a web-accessible path
      return "/pdf.worker.min.mjs";
    }
    // For production, return a file URL
    if (!isDev) {
      return `file://${workerPath}`;
    }
    // For development, return a relative path
    return "/pdf.worker.min.mjs";
  });
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

const expressApp = express();
expressApp.use(cors())
expressApp.use(express.json({ limit: '100mb' }));
expressApp.use(express.urlencoded({ extended: true, limit: '100mb' }));

const port = 8088;

expressApp.listen(port, () => {
  // eslint-disable-next-line prefer-template, prettier/prettier
  console.log('App server started: http://localhost:'+port)
});

// ルートの設定
expressApp.use('/auth', authRoutes);
expressApp.use('/notes', noteRoutes);
expressApp.use('/boards', boardRoutes);
expressApp.use('/bots', botRoutes);

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// **フォルダ選択ダイアログ**
async function selectSaveFolder() {
  const result = await dialog.showOpenDialog({
    title: "保存フォルダを選択",
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]; // 選択したフォルダのパスを返す
  }
  return null; // キャンセル時
}

// **ファイルをローカルに保存**
ipcMain.handle("save-file", async (_, fileData) => {
  try {
    const saveFolder = await selectSaveFolder();
    if (!saveFolder) {
      throw new Error("フォルダが選択されていません");
    }

    // ファイルパスを生成
    const filePath = path.join(saveFolder, fileData.name);

    // バイナリデータを保存
    fs.writeFileSync(filePath, Buffer.from(fileData.buffer));
    return filePath;
  } catch (error) {
    console.error("ファイル保存エラー:", error);
    throw error;
  }
});
