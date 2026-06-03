const { app, BrowserWindow, ipcMain, ipcRenderer, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');

//process.env.NODE_ENV === 'production'

let env = "pro";
if (process && process.env && process.env.APP_TYPE && process.env.APP_TYPE === "desktop_dev") {
  env = "dev";
}

let sysIcon = path.join(__dirname, './dist/icons/icon_256.ico');
if (env == "dev") {
  sysIcon = path.join(__dirname, '../public/icons/icon_256.ico');
}

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', () => {
  createWindow();     // 创建浏览器窗口
  setTrayIcon();      // 增加图标和菜单至系统通知栏
  // testElectron();     // 测试相关
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
		minWidth:1280,			// 窗口最小宽度，默认为 0
    minHeight: 600,			// 窗口最小高度，默认为 0
    backgroundColor: '#2e2c29',
    // frame: false,       // 无边框
    icon: sysIcon,
    // show: false,
    // fullscreen: true
    // frame: false,
    // center: true,
    // hasShadow: false,
  });

  if (env == "dev") {
    mainWindow.loadURL('http://localhost:8009/');
    // 打开开发者工具，默认不打开
    // mainWindow.webContents.openDevTools();
  } else {
    const startUrl = url.format({
      pathname: path.join(__dirname, './dist/index.html'),
      // pathname: path.join(__dirname, './dist/index.html/user/login'),//??
      protocol: 'file:',
      slashes: true,
    });
    mainWindow.loadURL(startUrl);
  }

  // 关闭window时触发下列事件.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null);

  // mainWindow.on('ready-to-show', function() {
  //   mainWindow.show();
  //   mainWindow.focus();
  // });
}

// 2019.1.24 update
// 设置同一时刻最多只会有一个实例，在第二个实例启动时激活主实例窗口的示例:
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// 所有窗口关闭时退出应用.
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

/*---------------------------------------------------------------------------------------------*\
	################################### 事件监听
\*---------------------------------------------------------------------------------------------*/

// 监听关闭窗体事件
// ipcMain.on('eeCloseMainWindow', (event, arg) => {
//   app.quit();
// })

/*---------------------------------------------------------------------------------------------*\
	################################### 增加图标和菜单至系统通知栏
\*---------------------------------------------------------------------------------------------*/
let tray = null
function setTrayIcon() {
  tray = new Tray(sysIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
        label: '基础版',
        enabled: false
    }, {
        label: '退出',
        click: function() {
          console.info("exit --");
        }
    }, {
      label: 'Item1',
      type: 'radio'
    }, {
      label: 'Item3',
      type: 'radio',
      checked: true
    },
  ])
  tray.setToolTip('基础版')
  tray.setContextMenu(contextMenu);
  // 切换窗口显示隐藏
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  })
}





/*---------------------------------------------------------------------------------------------*\
	################################### 测试相关
\*---------------------------------------------------------------------------------------------*/

function testElectron() {
	// 设置任务栏菜单
	// 设置任务栏图标
	//	winLogin.setProgressBar(0.2);
	//	console.info("app.getVersion = " + app.getVersion());					// app.getVersion = 0.1.0
	//	console.info("app.getName = " + app.getName());							// app.getName = myapp
	//	console.info("app.getLocale = " + app.getLocale());						// app.getLocale = zh-CN
	//	console.info("app.getAppPath = " + app.getAppPath());					// app.getAppPath = C:\Project\workspace\front-end\project\zntest\Electron\electron-v1.4.13-003
	//	console.info("app.getPath(home ) = " + app.getPath("home"));			// app.getPath(home ) = C:\Users\ThinkPad
	//	console.info("app.getPath(appData ) = " + app.getPath("appData"));		// app.getPath(appData ) = C:\Users\ThinkPad\AppData\Roaming
	//	console.info("app.getPath(userData ) = " + app.getPath("userData"));	// app.getPath(userData ) = C:\Users\ThinkPad\AppData\Roaming\myapp
	//	console.info("app.getPath(temp ) = " + app.getPath("temp"));			// app.getPath(temp ) = C:\Users\ThinkPad\AppData\Local\Temp
	//	console.info("app.getPath(exe ) = " + app.getPath("exe"));				// app.getPath(exe ) = C:\Project\workspace\front-end\project\zntest\Electron\electron-v1.4.13-003\node_modules\electron-pr
	//	console.info("app.getPath(module ) = " + app.getPath("module"));		//　ebuilt\dist\electron.exe
	//	console.info("app.getPath(desktop ) = " + app.getPath("desktop"));		//　app.getPath(desktop ) = C:\Users\ThinkPad\Desktop
	//	console.info("app.getPath(documents ) = " + app.getPath("documents"));	//　app.getPath(documents ) = C:\Users\ThinkPad\Documents
	//	console.info("app.getPath(downloads ) = " + app.getPath("downloads"));	//　app.getPath(downloads ) = C:\Users\ThinkPad\Downloads
	//	console.info("app.getPath(music ) = " + app.getPath("music"));			//　app.getPath(music ) = C:\Users\ThinkPad\Music
	//	console.info("app.getPath(pictures ) = " + app.getPath("pictures"));	//　app.getPath(pictures ) = C:\Users\ThinkPad\Pictures
	//	console.info("app.getPath(videos ) = " + app.getPath("videos"));		//　app.getPath(videos ) = C:\Users\ThinkPad\Videos
}
