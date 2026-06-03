# 利用electron和electron-builder部署桌面应用
### 采用双 package.json 的形式

## 目录结构
├─app
│  ├─main.js
│  ├─package.josn
├─package.josn

## 编辑开发目录packape.json

### 增加生成脚本（可增加淘宝镜像）
  "scripts": {
    "build-win1": "electron-builder --win",
    "build-win2": "electron-builder ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ --win",
  }

### 编辑build字段

## 安装依赖
cnpm install --save-dev electron
cnpm install --save-dev electron-builder

## 参考资料
https://www.electron.build/configuration/configuration
https://www.electron.build/tutorials/two-package-structure
http://www.php.cn/div-tutorial-411690.html
https://www.cnblogs.com/xueyoucd/p/8006610.html
