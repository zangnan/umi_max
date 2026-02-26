const fs = require('fs');
const path = require('path');

// 不参与遍历的文件夹
const excludeFolder = ['.git', '.husky', '.husky\\_', 'app', 'dist', 'mock', 'node_modules', 'public', 'src\\.umi', 'src\\.umi-production', 'src\\.umi-test', 'src\\assets'];
// 不参与遍历的文件
const excludeFiles = ['.eslintrc.js', 'fs.js', '.gitignore', '.lintstagedrc', '.npmrc', '.prettierignore', '.prettierrc', '.stylelintrc.js', 'package-lock.json', 'package.json', 'yarn.lock', 'README.md', 'tsconfig.json', 'typings.d.ts'];

// 删除指定文件夹
function deleteFolderRecursive(folderPath) {
	if (fs.existsSync(folderPath)) {
		// 读取文件夹列表
		const files = fs.readdirSync(folderPath);
		// 遍历文件夹列表
		files.forEach(function (fileName) {
			// 拼接当前文件路径
			const filePath = path.join(folderPath, fileName);
			// 判断该路径是文件夹还是文件
			const stats = fs.statSync(filePath);
			if (stats.isDirectory()) { // 判断是否是文件夹
				deleteFolderRecursive(filePath); // 递归删除子文件夹
			} else {
				fs.unlinkSync(filePath); // 删除文件
			}
		});
		fs.rmdirSync(folderPath); // 删除空文件夹
	}
}

// 删除指定文件
function deleteFile(filePath) {
	fs.unlink(filePath, function(err){
		if (err) {
			throw err;
		}
	}); // 删除文件
}

// 替换指定文件内容
function traverseFolder(folderPath) {
	// 读取文件夹列表
	const files = fs.readdirSync(folderPath);
	// 遍历文件夹列表
	files.forEach(function (fileName) {
		// 拼接当前文件路径
		const filePath = path.join(folderPath, fileName);
		// 判断该路径是文件夹还是文件
		const stats = fs.statSync(filePath);
		if (stats.isDirectory()) { // 如果是文件夹，递归遍历
			// 排除不需要遍历的文件夹
			if (!excludeFolder.includes(filePath)) {
				traverseFolder(filePath);
			}
		} else { // 如果是文件，执行操作
			if (!excludeFiles.includes(filePath)) {
				fs.readFile(filePath, (err, data) => {
					if (err) {
						console.log(`${filePath}读取失败`);
						return;
					}
					// 读取成功之后是一个buffer数据，可以通过toString()转为字符串
					let replacedData = data.toString();
					// 屏蔽easy_dev相关代码
					replacedData = replacedData.replace("import routesEasyDevDc from './routes/routes.easyDevDc';", "");
					replacedData = replacedData.replace("routes = routesEasyDevDc.concat(routes);", "");
					replacedData = replacedData.replace("import nbglxtUtil from '@/pages/nbglxt/common/nbglxtUtil';", "");
					replacedData = replacedData.replace("await nbglxtUtil.app.init()", "");
					// 将新内容写回文件
					fs.writeFile(filePath, replacedData, 'utf8', (writeErr) => {
						if (writeErr) {
							return console.error(writeErr);
						}
					});
				})
			}
		}
	})
}

// 二次确认窗口
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('确认执行此操作吗？(y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
	// 删除文件
	deleteFile('./config/routes/routes.easyDevDc.ts');
	// 删除文件夹
	deleteFolderRecursive('./src/.umi');
	deleteFolderRecursive('./src/.umi-production');
	deleteFolderRecursive('./src/.umi-test');
	deleteFolderRecursive('./src/pages/easy_dev_dc');
	deleteFolderRecursive('./src/pages/nbglxt');
	deleteFolderRecursive('./public/import_template/v0.2node');
	deleteFolderRecursive('./public/import_template/v0.2/bak');
	deleteFolderRecursive('./public/import_template/v0.2/nbglxt');
	deleteFolderRecursive('./public/pdfUsedChiFont');
	deleteFolderRecursive('./.git');
	deleteFolderRecursive('./.history');
	deleteFolderRecursive('./.husky');
	deleteFolderRecursive('./.claude');
	deleteFolderRecursive('./app');
	// 替换文件内容
	traverseFolder('./');
  } else {
    console.log('操作已取消');
  }

  rl.close(); // 关闭readline接口
});


