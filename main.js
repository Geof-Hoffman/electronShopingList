const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//set Env (uncomment for production)
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function () {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file',
        slashes: true
    }));
    //quit app on close
    mainWindow.on('closed', function () { app.quit(); });



    //Build menau from tem[palte 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//handle add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add Shpooing list items",
        webPreferences: {
            nodeIntegration: true
        }
    });

    //load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //Garbage Collection
    addWindow.on('close', function () {
        addWindow = null;
    });
}

//catch Item:add 
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    
    addWindow.close();
});

//create menu template
const mainMenuTemplate = [
    {
        label: 'file',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platorm == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }

        ]

    }
];

// if mac fix menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}
//add develeoper tools if inb devmode

if(process.env.node_env != 'production'){
    mainMenuTemplate.push({
        label:'developer Tools',
        submenu:[
            {
                label: "Toggle Dev Tools",
                accelerator: process.platorm == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },
            },
                {   
                    role:'reload'
                }
            
        ]
    })
}