/*----------------------------------------------------
---（必须重写该函数）返回获取的设备数目及设备名称  ---
-----------------------------------------------------*/
function GetDevCountAndNameResultCB(devCount, devNameArr) {
  if (devCount > 0) {
    var obj = document.getElementById("DevName");
    var CamID = 0;
    if (obj) {
      obj.options.length = 0;
      for (var i = 0; i < devCount; i++) {
        var objOption = document.createElement("option");
        objOption.text = devNameArr[i];
        objOption.value = i;
        obj.options.add(objOption);
      }
      obj.selectedIndex = 0;
      CamID = obj.selectedIndex;
    }
    //获取分辨率
    Cam_GetDevResolution(CamID);
  } else {
    ShowInfo("没有发现合适的设备！");
  }
}

/*---------------------------------------------------
---  （必须重写该函数）返回获取的设备分辨率信息   ---
----------------------------------------------------*/
function GetResolutionResultCB(resCount, resArr) {
  if (resCount > 0) {
    var selectIndex = 0;
    var obj = document.getElementById("DevResolution");
    if (obj) {
      obj.options.length = 0;
      for (var i = 0; i < resCount; i++) {
        var objOption = document.createElement("option");
        objOption.text = resArr[i];
        objOption.value = i;
        obj.options.add(objOption);
        //默认500万分辨率打开
        if (resArr[i] == "2592*1944") {
          selectIndex = i;
        }
      }
      obj.selectedIndex = selectIndex;
      //打开摄像头
      Cam_Close();
      var restr = obj[obj.selectedIndex].text;
      var pos = restr.lastIndexOf("*");
      var width = parseInt(restr.substring(0, pos));
      var height = parseInt(restr.substring(pos + 1, restr.length));
      var CamID = document.getElementById("DevName").selectedIndex;
      Cam_Open(CamID, width, height);
    } else {
      Cam_Open(0, 2592, 1994);
    }
  } else {
    ShowInfo("获取分辨率信息失败！");
  }
}

/*---------------------------------------------------
---     （必须重写该函数）返回摄像头开启状态      ---
----------------------------------------------------*/
function GetCameraOnOffStatus(status) {
  if (status == 0) {
    ShowInfo("设备开启成功");
    //Cam_Rotate(1);   // 0-> 0度, 1->90度, 2->180度, 3->270度
  } else {
    ShowInfo("设备开启失败!");
  }

}

/*---------------------------------------------------
--------     （必须重写该函数）拍照结果     ---------
----------------------------------------------------*/
// function GetCaptrueImgResultCB(flag, path, base64Str) {
//   if (flag == 0) {
//     var obj = document.getElementById("CameraPhoto");
//     obj.src = "data:;base64," + base64Str;
//     if (path == "") {
//       ShowInfo("拍照成功");
//     } else {
//       ShowInfo("拍照成功，图片保存位置：" + path);
//     }
//   } else {
//     ShowInfo("拍照失败!");
//   }
// }

// 拍照结果调整：多张照片
function GetCaptrueImgResultCB(flag, path, base64Str) {
  if (flag === 0) {
    // 图片base64
    var imgBase64 = "data:;base64," + base64Str;
    // 图片Html
    var imgHtml = '<img id="CameraPhoto"  src="' + imgBase64 + '" style="width: 198px; height: 198px"/>';
    var obj = document.getElementById("CameraPhotoImgList");
    obj.innerHTML = obj.innerHTML + imgHtml;
    if (path === "") {
      ShowInfo("拍照成功");
    } else {
      ShowInfo("拍照成功，图片保存位置：" + path);
    }
  } else {
    ShowInfo("拍照失败!");
  }
}

// 提交数据
function Cam_Save() {
  var imgSrcList = [];
  var imgList = document.getElementById("CameraPhotoImgList").getElementsByTagName('img');
  for (i = 0; i < imgList.length; i++) {
    imgSrcList.push(imgList[i].src);
  }
  console.log(imgSrcList);
}

function ShowInfo(op) {
  var obj = document.getElementById("TextInfo");
  if (obj) {
    obj.value = obj.value + "\r\n" + op
  }
}

/*---------------------------------------------------
-------（必须重写该函数）获取驱动盘符返回结果--------
----------------------------------------------------*/
function GetDriveResultCB(driveStr) {
  if (driveStr == "") {
    ShowInfo("获取盘符失败!");
  } else {
    ShowInfo(driveStr);
  }
}

//设置水印
function toSetWaterMarkParams() {
  var isAddMark;
  var isAddTime;
  var wTransp;
  var wPos;
  var wSize;
  var wColor;
  var szInfo;
  var obj = document.getElementById("Checkbox3");
  if (obj.checked) isAddMark = 1;
  else isAddMark = 0;
  obj = document.getElementById("Checkbox4");
  if (obj.checked) isAddTime = 1;
  else isAddTime = 0;
  szInfo = document.getElementById("Text1").value; //水印内容
  wTransp = parseInt(document.getElementById("Text2").value); //透明度
  wSize = parseInt(document.getElementById("Text3").value); //水印大小
  wPos = document.getElementById("Select1").selectedIndex; //水印位置
  wColor = document.getElementById("Select2").selectedIndex; //水印颜色
  SetWaterMark(isAddMark, 0, isAddTime, wTransp, wPos, wSize, wColor, szInfo); //生效水印设置
}

//删除文件返回结果
function GetDeleteFileResultCB(flag) {
  if (flag == 0) {
    ShowInfo("删除文件成功");
  } else {
    ShowInfo("删除文件失败！");
  }
}

/*---------------------------------------------------
--------     （必须重写该函数）图像合并结果     ---------
----------------------------------------------------*/
function MergeImagesResultCB(flag, base64Str) {
  if (flag == 0) {
    ShowInfo("图像合并完成");
    var obj = document.getElementById("CameraPhoto");
    obj.src = "data:;base64," + base64Str;
  } else {
    ShowInfo("图像合并失败!");
  }
}

/*---------------------------------------------------
--------     添加合并图像文件返回结果     ---------
----------------------------------------------------*/
function AddMergeImageFileResultCB(flag, base64Str) {
  if (flag == 0) {
    ShowInfo("添加合并图像文件成功");
    var obj = document.getElementById("CameraPhoto");
    obj.src = "data:;base64," + base64Str;
  } else {
    ShowInfo("添加合并图像文件失败!");
  }
}

/*---------------------------------------------------
------  （必须重写该函数）身份证信息返回结果   ------
----------------------------------------------------*/
function GetIdCardInfoResultCB(flag, Name, Sex, Nation, Born, Address, CardNum, IssuedAt, EffectedDate, CardImgPath, CardImgBase64) {
  if (flag == 0) {
    document.getElementById("CardName").value = Name;
    document.getElementById("CardSex").value = Sex;
    document.getElementById("CardNation").value = Nation;
    document.getElementById("CardBorn").value = Born;
    document.getElementById("CardAddress").value = Address;
    document.getElementById("CardNum").value = CardNum;
    document.getElementById("CardIssuedAt").value = IssuedAt;
    document.getElementById("CardEffectDate").value = EffectedDate;
    var obj = document.getElementById("IdCardPhoto");
    obj.src = "data:;base64," + CardImgBase64;
    ShowInfo("读卡成功");
  } else {
    ShowInfo("读卡失败!");
  }
}

/*-------------------------------------------------------------------
------  （必须重写该函数）身份证信息及正反面合并照片返回结果   ------
--------------------------------------------------------------------*/
function GetIdCardInfoAndImgResultCB(flag, Name, Sex, Nation, Born, Address, CardNum, IssuedAt, EffectedDate, CardImgPath, CardHeadImgBase64, CardImgBase64) {
  if (flag == 0) {
    document.getElementById("CardName").value = Name;
    document.getElementById("CardSex").value = Sex;
    document.getElementById("CardNation").value = Nation;
    document.getElementById("CardBorn").value = Born;
    document.getElementById("CardAddress").value = Address;
    document.getElementById("CardNum").value = CardNum;
    document.getElementById("CardIssuedAt").value = IssuedAt;
    document.getElementById("CardEffectDate").value = EffectedDate;
    var obj = document.getElementById("IdCardPhoto");
    obj.src = "data:;base64," + CardHeadImgBase64;
    var obj = document.getElementById("CameraPhoto");
    obj.src = "data:;base64," + CardImgBase64;
    ShowInfo("读卡成功");
  } else {
    ShowInfo("读卡失败!");
  }
}

//时间格式化显示
function formatDate(time) {
  var date = new Date(time);
  var year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  var newTime = year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day) + (hour < 10 ? '0' + hour : hour) + (min < 10 ? '0' + min : min) + (sec < 10 ? '0' + sec : sec);
  return newTime;
}

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

/*---------------------------------------------------
------  （必须重写该函数）条码二维码识别返回结果------
----------------------------------------------------*/
function QrBarCodeRecogResultCB(flag, codeStr) {
  if (flag == 0) ShowInfo("条码/二维码 识别结果:" + codeStr);
  else ShowInfo("未识别到内容!");
}

/*********************
 ***    初始化操作  ***
 **********************/

function LoadCameraDocument() {
  if (!window.WebSocket) {
    alert("浏览器不支持HTML5,请更新浏览器或者使用其它浏览器");
  }
  var obj = document.getElementById("CameraCtl");
  if (obj) {
    var canvas = document.getElementById("MainCamCanvas");
    if (!canvas) {
      Cam_ControlInit(obj, 0, 0, 890, 670);
    }
  }
}

window.onload = function () {
  // console.log("window.onload");
}

/*********************
 ***    打开摄像头  ***
 **********************/
function toOpenCamera() {
  var CamID = document.getElementById("DevName").selectedIndex;
  var obj = document.getElementById("DevResolution");
  var restr = obj[obj.selectedIndex].text;
  var pos = restr.lastIndexOf("*");
  var width = parseInt(restr.substring(0, pos));
  var height = parseInt(restr.substring(pos + 1, restr.length));
  Cam_Open(CamID, width, height);
}

/*********************
 ***    关闭摄像头  ***
 **********************/
function toCloseCamera() {
  Cam_Close();
}

/*********************
 ***    切换摄像头  ***
 **********************/
function SelectDevice() {
  alert('切换摄像头');
  var CamID = document.getElementById("DevName").selectedIndex;
  //获取分辨率
  Cam_GetDevResolution(CamID);
}

/*********************
 ***    切换分辨率  ***
 **********************/
function SelectResolution() {
  alert('切换分辨率');
  var obj = document.getElementById("DevResolution");
  var restr = obj[obj.selectedIndex].text;
  var pos = restr.lastIndexOf("*");
  var width = parseInt(restr.substring(0, pos));
  var height = parseInt(restr.substring(pos + 1, restr.length));
  var CamID = document.getElementById("DevName").selectedIndex;
  Cam_Open(CamID, width, height);
}

/*********************
 ***       拍照     ***
 **********************/
async function TakePhoto() {
  Cam_SetJpgQuality(60);
  var name = formatDate(new Date().getTime());
  var obj = document.getElementById("FileType");
  var path;
  if (!obj) {
    obj = {
      selectedIndex: 0,
    }
  }
  Cam_SetFileType(obj.selectedIndex); //设置文件格式
  if (obj.selectedIndex == 0) {
    path = "C:\\gpy\\" + name + ".jpg";
  } else if (obj.selectedIndex == 1) {
    path = "C:\\gpy\\" + name + ".png";
  } else if (obj.selectedIndex == 2) {
    path = "C:\\gpy\\" + name + ".tif";
  } else if (obj.selectedIndex == 3) {
    path = "C:\\gpy\\" + name + ".pdf";
  } else {
    path = "C:\\gpy\\" + name + ".jpg";
  }
  Cam_Photo(path); //主摄像头拍照
  const ret = await ReceiveMessage(name, new Date().getTime());
  return ret;
}

function ReceiveMessage(name, time) {
  return new Promise((resolve) => {
    socket.onmessage = function (event) {

      var rDataArr = new Uint8Array(event.data);
      if (rDataArr.length > 0) {
        if (rDataArr[0] == 0x11 && rDataArr[1] == 0x11 && rDataArr[2] == 0x11) {
          console.log("heart socket!!!!");
        }

        if (rDataArr[0] == 0x55 && rDataArr[1] == 0x66) {
          //摄像头数目返回
          if (rDataArr[2] == 0x50) {
            var devCount = rDataArr[3];
            var devNameBufLen = rDataArr.length - 4;
            var devNameData = new Uint8Array(devNameBufLen);
            for (var i = 0; i < devNameBufLen; i++) {
              devNameData[i] = rDataArr[4 + i];
            }
            //var AllCamName = Uint8ArrayToString(devNameData);
            var str = byteToString(devNameData);
            var AllCamName = decodeURIComponent(str);
            var camName = new Array();
            camName = AllCamName.split('|');
            GetDevCountAndNameResultCB(devCount, camName);
          }

          //摄像头分辨率返回
          if (rDataArr[2] == 0x51) {
            var resCount = rDataArr[3];
            var resArr = new Array();
            for (var i = 0; i < resCount; i++) {
              var width = rDataArr[4 + i * 4 + 0] * 256 + rDataArr[4 + i * 4 + 1];
              var height = rDataArr[4 + i * 4 + 2] * 256 + rDataArr[4 + i * 4 + 3];
              var resStr = "" + width + "*" + height;
              resArr.push(resStr);
            }
            GetResolutionResultCB(resCount, resArr);
          }

          //摄像头开启状态返回
          if (rDataArr[2] == 0x01) {
            if (rDataArr[3] == 0x01) {
              isOpenMainCamera = true;
              GetCameraOnOffStatus(0);
            }
            if (rDataArr[3] == 0x03) {
              isOpenMainCamera = false;
              GetCameraOnOffStatus(1);
            }
          }

          if (rDataArr[2] == 0xA5) {
            var flag;
            if (rDataArr[3] == 0x00) {
              flag = 2;
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (flag == 0) {
              var ResultStr = "";
              var pDataLen = rDataArr.length - 4;
              if (pDataLen > 0) {
                var pData = new Uint8Array(pDataLen);
                for (var i = 0; i < pDataLen; i++) {
                  pData[i] = rDataArr[4 + i];
                }
                var str = byteToString(pData);
                console.log(str);
                ResultStr = decodeURIComponent(str);
              }
              console.log(ResultStr);
            }
          }

          //当前拍照状态返回
          if (rDataArr[2] == 0x10) {
            //console.log(rDataArr[3]);
            //GetCaptrueStatusResultCB(rDataArr[3]);
          }

          //拍照结果返回
          if (rDataArr[2] == 0x10) {
            var flag;
            if (rDataArr[3] == 0x01) {
              flag = 0;
              var imgpathLen = rDataArr[4] * 256 + rDataArr[5];
              if (imgpathLen == 0) {
                var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                var imgPathStr = "";
                var base64Data = new Uint8Array(base64Len);
                for (var i = 0; i < base64Len; i++) {
                  base64Data[i] = rDataArr[9 + imgpathLen + i];
                }
                var base64Str = Uint8ArrayToString(base64Data);
                var imgBase64 = "data:image/png;base64," + base64Str;
                resolve(imgBase64);
                // GetCaptrueImgResultCB(flag, imgPathStr, base64Str);
              } else {
                var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                var pData = new Uint8Array(imgpathLen);
                for (var i = 0; i < imgpathLen; i++) {
                  pData[i] = rDataArr[9 + i];
                }
                var str = byteToString(pData);
                var imgPathStr = decodeURIComponent(str);

                var base64Data = new Uint8Array(base64Len);
                for (var i = 0; i < base64Len; i++) {
                  base64Data[i] = rDataArr[9 + imgpathLen + i];
                }
                var base64Str = Uint8ArrayToString(base64Data);
                var imgBase64 = "data:image/png;base64," + base64Str;
                resolve({
                  thumbUrl: imgBase64,
                  name: name,
                  scsj: time,
                  upload: true,
                });
                // GetCaptrueImgResultCB(flag, imgPathStr, base64Str);
              }
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
              GetCaptrueImgResultCB(flag, "", "");
            }

          }

          //身份证信息返回
          if (rDataArr[2] == 0x80) {
            var flag;
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            var pDataLen = rDataArr.length - 4;
            var pData = new Uint8Array(pDataLen);
            for (var i = 0; i < pDataLen; i++) {
              pData[i] = rDataArr[4 + i];
            }
            var str = byteToString(pData);
            var AllInfoStr = decodeURIComponent(str);
            var resultStr = new Array();
            resultStr = AllInfoStr.split(';');
            //console.log(resultStr);
            GetIdCardInfoResultCB(flag, resultStr[0], resultStr[1], resultStr[2], resultStr[3], resultStr[4], resultStr[5], resultStr[6], resultStr[7], resultStr[8], resultStr[9]);
          }

          //身份证信息及证件合并照片信息返回
          if (rDataArr[2] == 0x81) {
            var flag;
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }

            var pDataLen = rDataArr.length - 4;
            var pData = new Uint8Array(pDataLen);
            for (var i = 0; i < pDataLen; i++) {
              pData[i] = rDataArr[4 + i];
            }
            var str = byteToString(pData);
            var AllInfoStr = decodeURIComponent(str);
            var resultStr = new Array();
            resultStr = AllInfoStr.split(';');
            GetIdCardInfoAndImgResultCB(flag, resultStr[0], resultStr[1], resultStr[2], resultStr[3], resultStr[4], resultStr[5], resultStr[6], resultStr[7], resultStr[8], resultStr[9], resultStr[10]);
          }

          //上传结果返回
          if (rDataArr[2] == 0x90) {
            var flag;
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            if (rDataArr[3] == 0x03) {
              flag = 3;
            }
            var pDataLen = rDataArr.length - 6;
            if (pDataLen <= 0) {
              HttpResultCB(flag, ResultStr);
            }
            var pData = new Uint8Array(pDataLen);
            for (var i = 0; i < pDataLen; i++) {
              pData[i] = rDataArr[6 + i];
            }
            var str = byteToString(pData);
            console.log(str);
            var ResultStr = decodeURIComponent(str);
            console.log(ResultStr);
            HttpResultCB(flag, ResultStr);

          }

          if (rDataArr[2] == 0xC2) {
            var flag;
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            var pDataLen = rDataArr.length - 6;
            if (pDataLen <= 0) {
              OcrCallResultCB(flag, ResultStr);
            }
            var pData = new Uint8Array(pDataLen);
            for (var i = 0; i < pDataLen; i++) {
              pData[i] = rDataArr[6 + i];
            }
            var str = byteToString(pData);
            console.log(str);
            var ResultStr = decodeURIComponent(str);
            console.log(ResultStr);
            OcrCallResultCB(flag, ResultStr);

          }

          //条码二维码识别结果返回
          if (rDataArr[2] == 0x91) {
            var flag;
            if (rDataArr[3] == 0x00) {
              flag = 2; //未识别到内容
            }
            if (rDataArr[3] == 0x01) {
              flag = 0; //识别到内容
            }
            var ResultStr = "";
            var pDataLen = rDataArr.length - 4;
            if (flag == 0 && pDataLen > 0) {
              var pData = new Uint8Array(pDataLen);
              for (var i = 0; i < pDataLen; i++) {
                pData[i] = rDataArr[4 + i];
              }
              var str = byteToString(pData);
              ResultStr = decodeURIComponent(str);
            }
            console.log(ResultStr);
            QrBarCodeRecogResultCB(flag, ResultStr);

          }

          //添加合并PDF文件结果返回
          if (rDataArr[2] == 0x31) {
            var flag;
            var base64Len = rDataArr.length - 4;
            var base64Str = "";
            if (base64Len > 0) {
              var base64Data = new Uint8Array(base64Len);
              for (var i = 0; i < base64Len; i++) {
                base64Data[i] = rDataArr[4 + i];
              }
              base64Str = Uint8ArrayToString(base64Data);
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            AddImgFileToPDFResultCB(flag, base64Str);
          }

          //合并PDF结果返回
          if (rDataArr[2] == 0x32) {
            var flag;
            var base64Len = rDataArr.length - 4;
            var base64Str = "";
            if (base64Len > 0) {
              var base64Data = new Uint8Array(base64Len);
              for (var i = 0; i < base64Len; i++) {
                base64Data[i] = rDataArr[4 + i];
              }
              base64Str = Uint8ArrayToString(base64Data);
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            PdfCombineResultCB(flag, base64Str);
          }

          //添加合并图像文件结果返回
          if (rDataArr[2] == 0xC0) {
            var flag;
            var base64Len = rDataArr.length - 4;
            var base64Str = "";
            if (base64Len > 0) {
              var base64Data = new Uint8Array(base64Len);
              for (var i = 0; i < base64Len; i++) {
                base64Data[i] = rDataArr[4 + i];
              }
              base64Str = Uint8ArrayToString(base64Data);
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            AddMergeImageFileResultCB(flag, base64Str);
          }

          //合并图像结果返回
          if (rDataArr[2] == 0xC1) {
            var flag;
            var base64Len = rDataArr.length - 4;
            var base64Str = "";
            if (base64Len > 0) {
              var base64Data = new Uint8Array(base64Len);
              for (var i = 0; i < base64Len; i++) {
                base64Data[i] = rDataArr[4 + i];
              }
              base64Str = Uint8ArrayToString(base64Data);
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            if (rDataArr[3] == 0x02) {
              flag = 2;
            }
            console.log("MergeImagesResultCB 01");
            MergeImagesResultCB(flag, base64Str);
            console.log("MergeImagesResultCB 02");
          }

          if (rDataArr[2] == 0xA5) {
            var flag;
            if (rDataArr[3] == 0x00) {
              flag = 2;
            }
            if (rDataArr[3] == 0x01) {
              flag = 0;
            }
            var ResultStr = "";
            if (flag == 0) {
              var pDataLen = rDataArr.length - 4;
              if (pDataLen > 0) {
                var pData = new Uint8Array(pDataLen);
                for (var i = 0; i < pDataLen; i++) {
                  pData[i] = rDataArr[4 + i];
                }
                var str = byteToString(pData);
                ResultStr = decodeURIComponent(str);
              }
              // console.log(ResultStr);
            }
            GetLicenseResultCB(ResultStr);
          }

          //获取驱动盘符
          if (rDataArr[2] == 0xA6) {
            var strLen = rDataArr.length - 3;
            if (strLen > 0) {
              var driveData = new Uint8Array(strLen);
              for (var i = 0; i < strLen; i++) {
                driveData[i] = rDataArr[3 + i];
              }
              var driveStr = Uint8ArrayToString(driveData);
              GetDriveResultCB(driveStr);
            } else {
              GetDriveResultCB("");
            }
          }

          //删除文件结果
          if (rDataArr[2] == 0xA8) {
            var flag;
            if (rDataArr[3] == 0) {
              flag = 0;
            } else {
              flag = 2;
            }
            GetDeleteFileResultCB(flag);
          }

          //摄像头数据
          if (rDataArr[2] == 0xcc) {

            var ww = rDataArr[3] * 256 + rDataArr[4];
            var hh = rDataArr[5] * 256 + rDataArr[6];
            pMainShowStartX = rDataArr[7] * 256 + rDataArr[8];
            pMainShowStartY = rDataArr[9] * 256 + rDataArr[10];
            MainContext.clearRect(0, 0, MainCanvas.width, MainCanvas.height);
            var imgData = MainContext.createImageData(ww, hh);
            var dataNum = 0;
            dataNum = dataNum + 11;
            for (var i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 0] = rDataArr[dataNum];
              imgData.data[i + 1] = rDataArr[dataNum + 1];
              imgData.data[i + 2] = rDataArr[dataNum + 2];
              imgData.data[i + 3] = 255;
              dataNum = dataNum + 3;
            }

            MainContext.putImageData(imgData, pMainShowStartX, pMainShowStartY);

            if (MainCamCutMode == 2) {
              MainContext.strokeStyle = 'blue'; // 设置线条的颜色
              MainContext.lineWidth = 2; // 设置线条的宽度
              MainContext.beginPath(); // 绘制直线
              MainContext.rect(pALastX, pALastY, (pACurrentX - pALastX), (pACurrentY - pALastY));
              MainContext.closePath();
              MainContext.stroke();
            }
          }
          rDataArr = null;
        }
      }
    };
  });
}

function SetCameraCutMode() {
  if (document.getElementById("Radio1").checked) {
    Cam_SetCutMode(0);
  }
  if (document.getElementById("Radio3").checked) {
    Cam_SetCutMode(1);
  }
  if (document.getElementById("Radio2").checked) {
    Cam_SetCutMode(2);
  }
  if (document.getElementById("Radio4").checked) {
    Cam_SetCutMode(3);
    //设置裁剪区域
    SetCustomArea(3000, 3000, 9000, 9000);
  }
}

/*********************
 ***    读取身份证  ***
 **********************/
function GetIdCardInfo() {
  var path = "D:\\IdCard.jpg";
  //Cam_ReadIdCard(path);
  //Cam_ReadIdCard("");
  Cam_ReadIdCardEx(path);
}

/*********************
 ***    设置文件格式  ***
 **********************/
function toSetFileType() {
  var obj = document.getElementById("FileType");
  Cam_SetFileType(obj.selectedIndex);
}

/*********************
 ***    设置色彩模式  ***
 **********************/
function toSetColorModel() {
  var obj = document.getElementById("ColorMode");
  Cam_SetColorMode(obj.selectedIndex);
}

/*********************
 ***    设置JPG图像质量  ***
 **********************/
function toSetJpgQuality() {
  var obj = document.getElementById("JpgQuality");
  var val = obj[obj.selectedIndex].text;
  Cam_SetJpgQuality(val);
}

/*********************
 ***    设置去黑边  ***
 **********************/
function toSetDeleteBlackEdge() {
  var obj = document.getElementById("Checkbox1");
  if (obj.checked) {
    Cam_SetDeleteBlackEdge(1);
  } else {
    Cam_SetDeleteBlackEdge(0);
  }
}

/*********************
 ***    设置去底色  ***
 **********************/
function toSetDeleteBgColor() {
  var obj = document.getElementById("Checkbox2");
  if (obj.checked) {
    Cam_SetDeleteBgColor(1);
  } else {
    Cam_SetDeleteBgColor(0);
  }
}

/*---------------------------------------------------
--------     （必须重写该函数）上传结果     ---------
----------------------------------------------------*/
function HttpResultCB(flag, ResultStr) {
  if (flag == 0) {
    alert("上传成功 :" + ResultStr);
  } else {
    alert("上传失败！");
  }
}

/*********************
 ******    上传  ******
 **********************/
function HttpUploadFile() {
  var filePath = "D:\\test.pdf";
  //var url = "http://112.27.213.220:2201/interface/FileUploadCode.jsp";
  //var url = "http://localhost:9005/MyServletTest/upload";
  var url = "http://localhost:4523/UploadFile.ashx";
  //var url = "http://localhost:9005/MyServletTest/upload";
  UploadFile(url, filePath);
}

//从摄像头中识别二维码
function RecogQrCodeFromCamera(type) {
  Cam_RecogQrBarCodeFromCamera(type)
}

//从图片文件中识别二维码
function RecogBarCodeFromFile(type) {
  var imgpath = "D:\\123.jpg";
  Cam_RecogQrBarCodeFromFile(type, imgpath)
}

//添加要合并的PDF文件
function ToAddPDFFile() {
  //        Cam_AddImgFileToPDF("D:\\1.jpg");
  //        sleep(100);
  //        Cam_AddImgFileToPDF("D:\\2.jpg");
  //        sleep(100);
  //        Cam_AddImgFileToPDF("D:\\3.jpg");
  //        sleep(100);
  Cam_AddImgFileToPDF("");
  sleep(100);
}

/*---------------------------------------------------
--------     添加合并的PDF文件返回结果     ---------
----------------------------------------------------*/
function AddImgFileToPDFResultCB(flag, base64Str) {
  if (flag == 0) {
    ShowInfo("添加合并的PDF文件成功");
    var obj = document.getElementById("CameraPhoto");
    obj.src = "data:;base64," + base64Str;
  } else {
    ShowInfo("添加合并的PDF文件失败!");
  }
}

//PDF合并测试
function ToCombinePDF() {
  Cam_CombinePDF("D:\\test.pdf");
  //Cam_CombinePDF("");
}

/*---------------------------------------------------
--------     （必须重写该函数）合并PDF结果     ---------
----------------------------------------------------*/
function PdfCombineResultCB(flag, PdfBase64Str) {
  if (flag == 0) {
    ShowInfo("合并PDF完成");
    console.log(PdfBase64Str);
  } else {
    ShowInfo("合并PDF失败!");
  }
}

//添加要合并的图像文件
function ToAddMergeImageFile() {
  Cam_AddMergeImageFile("");
  sleep(100);
}

//图像合并测试
function ToMergeImages() {
  Cam_MergeImages("D:\\merge.jpg", 0);
}

//删除文件
function ToDeleteFile() {
  var path = "D:\\log.txt";
  DeleteFile(path);
}
