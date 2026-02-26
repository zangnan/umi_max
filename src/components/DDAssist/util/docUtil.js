const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const projectPath = path.resolve(__dirname, '../../');							// 输出路径 工程所在目录
const outPathSrc = path.resolve(__dirname, projectPath + '/src/');				// 输出路径 src
const outPathDoc = path.resolve(__dirname, projectPath + '/docs/dev/');			// 输出路径 docs

// 配置文件
let config = {
	docs: {
		files: [
			// {
			// source: `${outPathSrc}\\components\\DDAssist\\util\\index.tsx`,
			// target: `${outPathSrc}\\components\\DDAssist\\util\\util.md`
			// },
			// {
			// source: "D:\\work\\ddit\\code\\umi_max.240326_master\\src\\components\\DDAssist\\util\\index.tsx",
			// target: "D:\\work\\ddit\\code\\umi_max.240326_master\\src\\components\\DDAssist\\util\\util.md"
			// },
			{
				source: "D:\\work\\ddit\\code\\umi_max.240326_master\\src\\components\\DDAssist\\util\\index.tsx",
				target: "D:\\work\\ddit\\code\\rspress.2402.26\\docs\\component\\api\\util.md"
			},
		]
	},
};

/**
 *代码生成工具
 */
let codeCreateTools = {
	docs: null,
};

/**
 * 生成开发文档 单一
 */
codeCreateTools.doc = function(sourceFile, targetFile) {
	let readStream = fs.createReadStream(sourceFile);
	let writeStream = fs.createWriteStream(targetFile);
	let linesArr = [];
	let objReadline = readline.createInterface({
		input: readStream
	});
	new Promise(resolve => {
		objReadline.on('line', line => {
			if (line.indexOf('*') !== -1) {
				line = line.replace('\t\t', '');
				line = line.replace('\t', '');
				linesArr.push(line);
			}
			resolve(linesArr);
		});
	}).then(res => {
		for (var i = 0; i < res.length; i++) {
			if (res[i].indexOf('##') !== -1) { // 二级标题
				var bigTitle = `${res[i].replace('* ', '').replace(/^\s*/, '')}`;
				writeStream.write(bigTitle + os.EOL);
			}
			if (res[i].indexOf('@method') !== -1) { // 方法名
				var method = `### ${res[i].replace('* @method', '').replace(/^\s*/, '')}`;
				writeStream.write(method + os.EOL);
			}
			if (res[i].indexOf('@desc') !== -1) { // 方法描述
				var desc = `${res[i].replace('* @desc', '').replace(/^\s*/, '')}  `;
				writeStream.write(desc + os.EOL);
			}
			if (res[i].indexOf('@param') !== -1) { // 参数
				var param = '`param：`' + res[i].replace('* @param', '') + '  ';
				// writeStream.write(param + os.EOL);
			}
			if (res[i].indexOf('@returns') !== -1) { // 返回值
				var returnLine = '`returns：`' + res[i].replace('* @returns', '') + '  ';
				// writeStream.write(returnLine + os.EOL);
			}
			if (res[i].indexOf('@code') !== -1) { // 代码段
				var next = 1;
				var codeStr = '``` javascript';
				writeStream.write(codeStr + os.EOL);
				for (var j = 0; j < 999; j++) {
					if (res[i + next].indexOf('@End') === -1) {
						var codeLine = res[i + next].replace('*', '');
						writeStream.write(codeLine + os.EOL);
						next++;
					} else {
						continue;
					}
				}
				var endStr = '```';
				writeStream.write(endStr + os.EOL);

			}
		}
	});
	objReadline.on('close', () => {
		console.info(`开发文档：已生成至${targetFile}`);
	});
};

// 生成文档
codeCreateTools.doc(config.docs.files[0].source, config.docs.files[0].target);