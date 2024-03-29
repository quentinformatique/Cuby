const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win;
function createWindow () {
    // Create the browser window for the splash screen
    let splash = new BrowserWindow({
        width: 500,
        height: 300,
        transparent: true,
        frame: false,
        alwaysOnTop: true
    });

    // Load the splash screen html
    splash.loadFile('src/pages/splash.html');
    splash.setIcon(path.join(__dirname, '../img/icon.ico'));
    splash.center();


    win = new BrowserWindow({
        width: 1000,
        height: 790,
        minWidth: 1000,
        minHeight: 790,
        frame: false,
        backgroundColor: '#282c34',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),

            nodeIntegration: true,
        }
    })

    win.loadFile('src/pages/index.html');
    win.setIcon(path.join(__dirname, '../img/icon.ico'));


    win.once('ready-to-show', () => {
        splash.destroy();
        win.show();
    });


}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    ipcMain.handle('closeWindow', (event) => {
        app.quit();
    })

    ipcMain.handle('maximizeWindow', (event) => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    })

    ipcMain.handle('minimizeWindow', (event) => {
        console.log('minimize')
        win.minimize();
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

let moves = ["U", "D", "F", "B", "R", "L"]
let variations = ["", "'", "2"]
let minMoves = 20;
let maxMoves = 25;
let lengthScramble = Math.random() * (maxMoves - minMoves) + minMoves;

const { ipcRenderer } = require('electron');

function generateScramble() {
    let scramble = "";
    let lastMove = "";
    for (let i = 0; i < lengthScramble; i++) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        while (move === lastMove) {
            move = moves[Math.floor(Math.random() * moves.length)];
        }
        scramble += move + variations[Math.floor(Math.random() * variations.length)] + " ";
        lastMove = move;
    }
    return scramble;
}

ipcMain.handle('generateScramble', (event) => {
    return generateScramble();
});

app.whenReady()
    .then(() => {
        ipcMain.handle("getDeviceUserDataPath", () => {
            return app.getPath("userData");
        })
    });