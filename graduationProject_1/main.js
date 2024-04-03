const { app, BrowserWindow } = require( 'electron/main' );
const path = require( 'node:path' );

function createWindow() {
    const win = new BrowserWindow( {
        width         : 1920,
        height        : 1080,
        webPreferences: {
            preload: path.join( __dirname, 'preload.js' ),
        }
    } )

    win.loadFile( 'index.html' );
    // Open the DevTools.
   // win.webContents.openDevTools()
}
app.whenReady().then( () => {
    createWindow()

    app.on( 'activate', () => {
        if( BrowserWindow.getAllWindows().length === 0 ) {
            createWindow();
        }
    } );
} );

app.on( 'window-all-closed', () => {
    if( process.platform !== 'darwin' ) {
        app.quit()
    }
} );

