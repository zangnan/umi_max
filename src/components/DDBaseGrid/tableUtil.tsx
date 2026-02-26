import React, { Fragment } from 'react';
import myUtil from '../DDAssist/util';
import customerBuss from '../DDAssist/util/customerBuss';
import { Radio, Input, Space, Tooltip, Button, Tag, Badge, message, Typography, Switch } from 'antd';
import { QuestionCircleOutlined, CopyOutlined, PoweroffOutlined } from '@ant-design/icons';
import iconMapping, { iconColor } from '../DDAssist/constants/iconMapping';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { itemType } from "../DDForm/data.d";
import CONSTANTS from '../DDAssist/constants';
import { Link } from 'umi';
import customerIconMapping from '../DDAssist/util/customerIconMapping';
import { baseEdit } from '@/services/hts/api';

let tableUtil: any = {};

// 列表工具类
tableUtil = {
  // 列表初始化入口
  init(param: any) {
    let { columns } = param;
    // 渲染隐藏列
    columns = tableUtil.renderHidden(columns);
    // 遍历处理列
    columns.forEach((item: any) => {
      tableUtil.initColumn(item, param);
    });
    // 渲染操作列
    columns = tableUtil.renderHandleColumn(columns, param);
    return columns;
  },
  // 列表列初始化入口
  initColumn: (data: any, param: any) => {
    if (data.children && data.children.length > 0) {
      data.children.forEach((colChildren: any) => {
        tableUtil.initColumn(colChildren, param);
      })
    } else {
      tableUtil.initRender({targetColumn: data, param});
      tableUtil.renderFilter(data);
      tableUtil.renderCodeTable(data);
    }
  },
  // 渲染码表
  renderCodeTable: (data: any) => {
    const { codeTable, codeTableMatch } = data;
    if (codeTable) {
      data.ellipsis = { showTitle: false };
      if (!data.renderCopy) {
        data.renderCopy = {...data?.render}
      }
      let { map, tag, circle, icon, renderKey } = data.renderCopy;
      data.render = (text: any, item: any) => {
        // const textContent = codeTable[2] ? item[codeTable[2]] : text; // ???
        const textContent = text;
        let textContent2: any = myUtil.code.getCodeValByKey(textContent, codeTable, codeTableMatch);
        // 采用配置文件中的码表映射图标
        if (customerIconMapping[codeTable]?.icon?.length > 0) {
          // debugger;// code_dm_task_flag
          icon = customerIconMapping[codeTable].icon;
        }
        // 采用配置文件中的码表映射图标
        if (customerIconMapping[codeTable]?.tag?.length > 0) {
          tag = customerIconMapping[codeTable].tag;
        }
        if (map || tag || circle || icon) {
          // debugger;
          let renderIconKey = textContent;
          if (renderKey === 'codeTableValue') {
            renderIconKey = textContent2;
          }
          textContent2 = tableUtil.renderIcon({key: renderIconKey, text: textContent2, map, tag, circle, icon});
        };
        return <Tooltip placement="topLeft" title={textContent2}>
          {textContent2}
        </Tooltip>;
      };
    }
  },
  // 渲染列入口
  initRender: ({targetColumn, param}: any) => {
    // render
    if (targetColumn.render
        && typeof (targetColumn.render) !== 'function'
        && !targetColumn.codeTable) {
      const { type, format, func: RenderFunc, map, tag, circle, icon, mask, copy, poweroff,timeEasyRead } = targetColumn.render;
      targetColumn.renderOriginal = targetColumn.render; // 存贮原始数据: render 导出用
      if (type === 'number') {
        targetColumn.type = type;
        // 格式化数值格式
        targetColumn.render = (text: any) => {
          if (text && text.toString().indexOf('／') > -1) {
            const arr = text.split('／');
            return myUtil.grid.formatNum(arr[0], format) + '／' + myUtil.grid.formatNum(arr[1], format);
          } else if (text && text.toString().indexOf('/') > -1) {
            const arr = text.split('/');
            return myUtil.grid.formatNum(arr[0], format) + '/' + myUtil.grid.formatNum(arr[1], format);
          } else {
            return myUtil.grid.formatNum(text, format);
          }
        }
        targetColumn.format = format;
      } else if (type === 'date') {
        // 格式化日期格式
        targetColumn.render = (text: any) => {
          return myUtil.grid.formatDate(text, format);
        }
      } else if (type === 'mask') {
        targetColumn.render = (text: any) => {
          if (text.length > 4) {
            let reg = /^(\d{2})(\d*)(\d{2})$/;
            let str = text.replace(reg,(a: any, b: any, c: any, d: any)=> {
              return b + c.replace(/\d/g, '*') + d;
            });
            return str;
          } else {
            return '****';
          }
        }
      } else if (type === 'leaf' || type === 'rel' || type === 'rel2') {
        targetColumn.render = (text: any, record: any) => {
          let onClickFun: any = (event: any, allowEdit: any) => {
            event.stopPropagation();
            let rowKey = param.rowKey;
            let rowKeyValue = record[rowKey];
            let sonTableTitle = record[targetColumn.renderOriginal.titleDataIndex];
            let sonTableTitleField = param?.columns?.find((item5: any) => { return item5.dataIndex === targetColumn.renderOriginal.titleDataIndex });
            let keyField = param?.columns?.find((item6: any) => { return item6.dataIndex === rowKey });
            let param2 = {
              rowKey,
              rowKeyValue,
              dataIndex: targetColumn.dataIndex,
              sonTableTitle: `${sonTableTitleField?.title}：${sonTableTitle}`,
              modalTitle: `编辑${targetColumn?.title}`,
              sonConfig: targetColumn.renderOriginal.config,
              // sonFunc: targetColumn.renderOriginal.func, // ??
              sonFunc: param?.func,
              sonConfig2: targetColumn.renderOriginal.config2,
              keyField,
              record,
              titleDataIndex: targetColumn.renderOriginal.titleDataIndex,
              param,
              allowEdit,
            }
            if (type === 'leaf') {
              param?.refSonTableModal?.current?.showModal(param2);
            } else if (type === 'rel' || type === 'rel2') {
              param?.refRelTableModal?.current?.showModal(param2);
            }
          }
          let allowEditFlag = true;
          if (param?.func?.isSonTableEdit) {
            allowEditFlag = param?.func?.isSonTableEdit({record});
          }
          let aDomAllowEdit = <a onClick={(event: any) => { onClickFun(event, true); }}>编辑</a>;
          let aDomNotAllowEdit = <a onClick={(event: any) => {onClickFun(event, false); }}>查看</a>
          return <>
            {allowEditFlag && aDomAllowEdit}
            {!allowEditFlag && aDomNotAllowEdit}
          </>;
        }
      } else if (type === 'json') {
        targetColumn.render = (text: any) => {
          const handleViewJson: any = (event: any) => {
            event.stopPropagation();
            myUtil.modal.viewJson({
              data: text,
            });
          }
          return <a onClick={(event: any) =>{handleViewJson(event)}}>{text}</a>;
        }
      } else if (type === 'RichTextEditor') {
        targetColumn.render = (text: any) => {
          if (text) {
            const handleViewJson: any = (event: any) => {
              event.stopPropagation();
              myUtil.modal.viewRichText({
                data: text,
              });
            }
            return <Button type='link' size='small' onClick={(event: any) =>{handleViewJson(event)}}>查看</Button>
          } else {
            return <Button type='link' size='small' disabled>查看</Button>;
          }
        }
      } else if (type === 'MarkdownEditor') {
        targetColumn.render = (text: any) => {
          if (text) {
            const handleViewJson: any = (event: any) => {
              event.stopPropagation();
              myUtil.modal.viewMarkdown({
                data: text,
              });
            }
            return <Button type='link' size='small' onClick={(event: any) =>{handleViewJson(event)}}>查看</Button>
          } else {
            return <Button type='link' size='small' disabled>查看</Button>;
          }
        }
      } else if (copy) {
        targetColumn.render = (text: any) => {
          if (text) {
            return <>
              <div style={{display: 'inline-block'}}>
                <CopyToClipboard text={text} onCopy={()=>{ message.info('已复制到剪贴板！');}} >
                  <Tooltip placement='top' title='复制'>
                    <CopyOutlined className='col-copy' style={{color: param?.themeToken?.Tag?.colorSuccess }} />
                  </Tooltip>
                </CopyToClipboard>
              </div>
              <Tooltip placement='top' title={text}>
                {text}
              </Tooltip>
            </>
          }
        }
      } else if (timeEasyRead) {
        targetColumn.render = (text: any) => {
          let costTime = text;
          if (costTime === 0) {
            return <Typography.Text>-</Typography.Text>;
          }
          if (costTime < 1000) {
            return <Typography.Text>{`${myUtil.text.formatNum(costTime, '0,0')  } 毫秒`}</Typography.Text>;
          }
          costTime /= 1000;
          if (costTime <= 10) {
            return <Typography.Text>{`${myUtil.text.formatNum(costTime, '0,0')  } 秒`}</Typography.Text>;
          }
          if (costTime <= 60) {
            return <Typography.Text type="danger">{`${myUtil.text.formatNum(costTime, '0,0')  } 秒`}</Typography.Text>;
          }
          return <Typography.Text type="danger">{`${myUtil.text.formatNum((costTime / 60), '0,0')  } 分`}</Typography.Text>;
        }
      } else if (poweroff) {
        targetColumn.align = 'center';
        targetColumn.width = targetColumn.width || 80;
        targetColumn.render = (text: any, record: any) => {
          return <Tooltip placement='top' title='变更状态'>
            <PoweroffOutlined className={text === 'Y' ? 'flag-open' : 'flag-close'}
                style={{color: text === 'Y' ? param?.themeToken?.Tag?.colorSuccess : param?.themeToken?.Tag?.colorBorder}}
                onClick={(event: any)=>{
              event.stopPropagation();
              const renderParam = {
                text,
                record,
                ...param,
              }
              if (param?.func.poweroff && param?.func.poweroff[poweroff]) {
                return param?.func.poweroff[poweroff](renderParam);
              }
            }}/>
          </Tooltip>
        }
      } else if ((map || tag  || circle || icon) && !targetColumn.codeTable) {
        // 如既有图标渲染又含有码表渲染，在码表渲染中处理
        // 格式化map
        targetColumn.render = (text: any) => {
          return tableUtil.renderIcon({text, map, tag, circle, icon});
        }
      } else if (type === 'media') {
        targetColumn.ellipsis = true;
        targetColumn.render = (text: any, record: any) => {
          let mediaType: any = '';
          let mediaName: any = '';
          let mediaPath: any = '';
          let mediaMD5: any = '';
          if (ENV_TYPE === 'node') {
            console.info(targetColumn, param);
            let dictFieldName = targetColumn.dict_field_name;
            let mediaFileMD5Field = `${dictFieldName}_media_file_md5`;
            mediaMD5 = record[mediaFileMD5Field];
            let mediaFileTypeField = `${dictFieldName}_media_type`;
            mediaType = record[mediaFileTypeField];
            let mediaFileNameField = `${dictFieldName}_media_name`;
            mediaName = record[mediaFileNameField];
            mediaPath = `${API_URL_BASE}/static/${mediaMD5}.${mediaType}`;
          } else {
            // id---type---name---path
            let mediaInfoArr: any = (text || '').split('---');
            mediaType = mediaInfoArr.length >= 1 ? mediaInfoArr[1] : '';
            mediaName = mediaInfoArr.length >= 2 ? mediaInfoArr[2] : '';
            mediaPath = mediaInfoArr.length >= 3 ? mediaInfoArr[3] : '';
          }
          if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
            return <>
              <Tooltip placement="topLeft" title={mediaName}>
                <span  onClick={() => {
                  let { refGrid } = param;
                  let picurl1 = `${mediaPath}`;
                  let picurl2 = `${mediaPath}`;
                  refGrid.current.setPreviewConfig({
                    imageVisible: true,
                    imageUrl: picurl1,
                    imagePreviewUrl: picurl2,
                  })
                }}>
                  <Typography.Link>
                    {myUtil.media.getMediaIcon(mediaType, text)}
                  </Typography.Link>
                </span>
              </Tooltip>
            </>
          } else {
            return <>
              <Tooltip placement="topLeft" title={mediaName}>
                <Link to={`/player?mediaPath=${mediaPath}`} target='_blank'>
                  <Typography.Link>
                    {myUtil.media.getMediaIcon(mediaType, text)}
                  </Typography.Link>
                </Link>
              </Tooltip>
            </>
          }
        }
      } else if (type === 'color') {
        targetColumn.render = (text: any) => {
          return <Tag color={text}>{text}</Tag>;
        }
      } else if (type === 'tagColor') {
        let colorMapping = customerIconMapping[`${targetColumn.dataIndex}_tag_color`] || [];
        targetColumn.render = (text: any) => {
          let tmpTargetColor;
          if (text) {
            tmpTargetColor = colorMapping?.find((item: any) => { return item.code === text });
            if (!tmpTargetColor?.code) {
              tmpTargetColor = colorMapping?.find((item: any) => { return item.code === 'ELSE' });
            }
          }
          return <Tag color={tmpTargetColor?.color || 'default'} variant="filled">{text}</Tag>
        }
      } else if (type === 'switch') {
        let checkValue = true;
        let unCheckValue = false;
        let tmpRenderValue = targetColumn.render.value;
        if (tmpRenderValue) {
          let aaa = tmpRenderValue.split(',');
          if (aaa.length > 0) {
            checkValue = aaa[0];
          }
          if (aaa.length > 1) {
            unCheckValue = aaa[1];
          }
        }
        const switchOnChange: any = ({checked, text, record, targetColumn, ...param2}: any) => {
          let apiPrefix = myUtil.api.getApiRoot();
          const apiFormEdit = `${apiPrefix}${param2.config.api_form_edit || CONSTANTS.DEFAULT_API.FORM_EDIT}`;
          let rowKey = param2.rowKey;
          let fromData: any = {
            key: param2.unitKey,
            formType: 'edit',
          };
          if (Array.isArray(rowKey)) {
            rowKey.forEach((rKey: any) => {
              fromData[rKey] = record[rKey];
            });
          } else {
            fromData[rowKey] = record[rowKey];
          }
          fromData[targetColumn.dataIndex] = checked ? checkValue : unCheckValue;
          baseEdit({ data: fromData, url: apiFormEdit }).then((res) => {
            // myUtil.modal.responseInfo(res);
            param2.refGrid?.current?.reload();
          })
        }
        targetColumn.align = 'center';
        targetColumn.width = targetColumn.width || 80;
        targetColumn.render = (text: any, record: any) => {
          return <Switch checked={text === checkValue} size="small"
            onChange={(checked: boolean) => switchOnChange({checked, text, record, targetColumn, ...param})} />
        }
      } else {
        // 自定义格式化方法
        targetColumn.format = format;
        targetColumn.render = (text: any, record: any) => {
          const renderParam = {
            text,
            record,
            ...param,
          }
          if (param?.func.columnsRender && param?.func.columnsRender[RenderFunc]) {
            return param?.func.columnsRender[RenderFunc](renderParam);
          }
        }
      }
    }
    // ellipsis
    if (!targetColumn.render && targetColumn.ellipsis) {
      // 没有render 并且有elipse
      targetColumn.ellipsis = { showTitle: false, }
      targetColumn.render = (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    }
    // title
    if (targetColumn.title?.toString().indexOf('{br}') > -1) {
      targetColumn.titleOriginal = targetColumn.title.replace(new RegExp('{br}', 'g'), '');; // 存贮原始数据: title 导出用
      const titleBrArr: any = targetColumn.title.split('{br}');
      const titleBr: any = [];
      titleBrArr?.forEach((title: any, index: number) => {
        titleBr.push(title);
        if (index !== titleBrArr.length - 1) {
          titleBr.push(<br key={index.toString()} />);
        }
      })
      targetColumn.title = <span>{titleBr}</span>;
    }
    // title tooltip
    if (targetColumn.titleTooltip) {
      targetColumn.titleOriginal = targetColumn.title; // 存贮原始数据: title 导出用
      const tooltip: any = [];
      const titleTooltipArr: any = targetColumn.titleTooltip.split('{br}');
      titleTooltipArr?.forEach((tip: any, index: number) => {
        tooltip.push(tip);
        if (index !== titleTooltipArr.length) {
          tooltip.push(<br key={index.toString()} />);
        }
      });
      targetColumn.title = <>
        <Tooltip title={tooltip}>
          <span>{targetColumn.title} <QuestionCircleOutlined /></span>
        </Tooltip>
      </>;
      delete targetColumn.titleTooltip;
    }
  },
  // 渲染图形
  renderIcon: ( {key, text, map, tag, circle, icon, isShowText = true}: any) => {
    // 显示文字
    let showText: any = text;
    if (map && map.length > 0) {
      let targetEle = map?.find((item: any) => { return item.value === (key ? key : text) });
      if (!targetEle) {
        targetEle = map?.find((item: any) => { return item.value === '' });
      }
      showText = targetEle?.text;
    }
    // Tag
    if (tag && tag.length > 0) {
      let targetEle = tag?.find((item: any) => { return item.value === (key ? key : text) });
      if (!targetEle) {
        targetEle = tag?.find((item: any) => { return item.value === '' });
      }
      if (showText) {
        showText = <Tag color={targetEle?.color || 'default'} variant="filled">{showText}</Tag>;
      }
    }
    // circle
    if (circle && circle.length > 0) {
      let targetEle = circle?.find((item: any) => { return item.value === (key ? key : text) });
      if (!targetEle) {
        targetEle = circle?.find((item: any) => { return item.value === '' });
      }
      showText = <Space size={5}>
        <Badge status={targetEle?.color || 'default'} key={targetEle?.color || 'default'} />
        {showText}
      </Space>;
    }
    // icon
    if (icon && icon.length > 0) {
      // debugger;
      let targetEle: any = icon?.find((item: any) => { return item.value === (key ? key : text) });
      if (!targetEle) {
        targetEle = icon?.find((item: any) => { return item.value === '' });
      }
      // debugger;
      // console.info(targetEle?.isShowText);
      showText = <Space size={5}>
        <span style={{color: iconColor[targetEle?.color]}}>{iconMapping[targetEle?.icon]}</span>
        {(targetEle?.isShowText === undefined || targetEle.isShowText) ? showText : ''}
      </Space>;
    }
    return showText;
  },
  // 渲染隐藏列
  renderHidden: ((columns: any) => {
    columns.filter((col: any) => {
      return (!(col.hidden && col.hidden !== false));
    });
    return columns;
  }),
  // 获取操作列宽度
  getHandleColumnWidth: (param: any) => {
    const { handleColumnsDefault, handleColumns } = param;
    let widMyHandleColumn = 0;
    if (handleColumnsDefault?.edit) {
      widMyHandleColumn += 55;
    }
    if (handleColumnsDefault?.delete) {
      widMyHandleColumn += 55;
    }
    if (handleColumnsDefault?.detail) {
      widMyHandleColumn += 55;
    }
    if (handleColumns) {
      handleColumns.forEach((item: any) => {
        const txtLen = item?.name?.length || 0;
        widMyHandleColumn += 16 * txtLen + 15;
      });
    }
    return widMyHandleColumn;
  },
  // 渲染列头过滤
  renderFilter: (targetColumn: any) => {
    if (targetColumn.filter) {
      let { type, list, codeTable, showCode } = targetColumn.filter;
      if (typeof (type) === 'string') {
        type = itemType[type];
      }
      if (type === itemType.Select) {
        if (list?.length > 0) {
          targetColumn.filters = list;
        } else if (codeTable) {
          const tmpList: any = myUtil.code.getHeaderFilterOption(codeTable, showCode);
          targetColumn.filters = tmpList;
        }
        // 筛选项支持筛选
        targetColumn.filterSearch = true;
      } else if (type === itemType.treeSelect) {
        targetColumn.filters = list;
        targetColumn.filterMode = 'tree';
        targetColumn.filterSearch = true;
      } else if (type === itemType.Radio) {
        const arr: any = [];
        let tmpList: any;
        if (list?.length > 0) {
          tmpList = list;
        } else if (codeTable) {
          tmpList = myUtil.code.getHeaderFilterOption(codeTable, showCode);
        }
        if (!(list?.length > 0)) {
          arr.push(<Radio key={tmpList.length.toString()} value={''}>{'全部'}</Radio>);
        }
        tmpList.forEach((item: any, index: number) => {
          arr.push(<Radio key={index.toString()} value={item.value}>{item.text}</Radio>);
        });
        targetColumn.filterDropdown = (params: any) => (
          // params = { setSelectedKeys, selectedKeys, confirm, clearFilters }
          <div style={{ padding: "10px" }}>
            <Radio.Group defaultValue={1} onChange={(e) => {
              params?.setSelectedKeys(e.target.value ? [e.target.value] : []);
              params?.confirm();
            }}>
              <Space orientation="vertical" >
                {arr}
              </Space>
            </Radio.Group>
          </div>
        );
      } else if (type === itemType.Input) {
        targetColumn.filterDropdown = (params: any) => (
          <div style={{ padding: 8 }}>
            <Input.Search
              placeholder={`${targetColumn.title}`}
              // value={params?.selectedKeys[0]}
              // size="small"
              allowClear
              enterButton="查询"
              onSearch={(value: any) => {
                params?.setSelectedKeys(value ? [value] : []);
                params?.confirm();
              }}
              onPressEnter={(e: any) => {
                params?.setSelectedKeys(e.target.value ? [e.target.value] : []);
                params?.confirm();
              }}
            />
          </div>
        );
      }
    }
  },
  // 操作列
  renderHandleColumn: (columns: any, param: any) => {
    const { handleColumnsDefault, handleColumns, gridHandleWidth } = param;
    const myHandleColumn = ({
      title: '操作',
      width: gridHandleWidth || tableUtil.getHandleColumnWidth(param),
      fixed: 'right',
      align: 'center',
      render: tableUtil.getHandleColumnContent(param)
    });
    const [last] = [...columns].reverse();
    if (last && last.title !== '操作') {
      if (handleColumnsDefault?.edit || handleColumnsDefault?.delete || handleColumnsDefault?.detail) {
        columns.push(myHandleColumn);
      } else if (handleColumns && handleColumns.length > 0) {
        columns.push(myHandleColumn);
      }
    }
    return columns;
  },
  // 操作列
  getHandleColumnContent: (param: any) => {
    const { popupUpdate, popupDetail, handleDelete, handleColumnsDefault, handleColumns, func, unitKey } = param;
    const { auth_grid_handle_columns_defaul_edit, auth_grid_handle_columns_defaul_delete, auth_grid_handle_columns_defaul_detail } = param;
    return (record: any) => {
      let btnDisabledEdit: any = false;
      let btnDisabledDelete: any = false;
      let editConfigDisabled: any = handleColumnsDefault?.editConfig?.disabled;
      let deleteConfigDisabled: any = handleColumnsDefault?.deleteConfig?.disabled;
      if (typeof editConfigDisabled === 'string') {
        if (func && func[editConfigDisabled]) {
          btnDisabledEdit = func[editConfigDisabled](record);
        } else if (customerBuss && customerBuss[editConfigDisabled]) {
          btnDisabledEdit = customerBuss[editConfigDisabled](record);
        }
      }
      if (typeof deleteConfigDisabled === 'string') {
        if (func && func[deleteConfigDisabled]) {
          btnDisabledDelete = func[deleteConfigDisabled](record);
        } else if (customerBuss && customerBuss[deleteConfigDisabled]) {
          btnDisabledDelete = customerBuss[deleteConfigDisabled](record);
        }
      }
      const btnEdit = <Button type='link' size='small' key='btn_edit' disabled={btnDisabledEdit}
        onClick={(event: any) => func.popupUpdate ? func.popupUpdate(record, event) : popupUpdate(record, event)}>编辑</Button>;
      const btnDel = <Button type='link' size='small' key='btn_del'  disabled={btnDisabledDelete}
        onClick={(event: any) => func.handleDelete ? func.handleDelete(record, event) : handleDelete(record, event)}>删除</Button>;
      const btnDetail = <Button type='link' size='small' key='btn_detail'
        onClick={(event: any) => func.popupDetail ? func.popupDetail(record, event) : popupDetail(record, event)}>详情</Button>;
      const handleEle: any = [];
      // 默认按钮: 编辑
      if (handleColumnsDefault?.edit && (auth_grid_handle_columns_defaul_edit || auth_grid_handle_columns_defaul_edit === undefined)) {
        handleEle.push(btnEdit);
      }
      // 默认按钮: 删除
      if (handleColumnsDefault?.delete && (auth_grid_handle_columns_defaul_delete || auth_grid_handle_columns_defaul_delete === undefined)) {
        handleEle.push(btnDel);
      }
      // 默认按钮: 详情
      if (handleColumnsDefault?.detail && (auth_grid_handle_columns_defaul_detail || auth_grid_handle_columns_defaul_detail === undefined)) {
        handleEle.push(btnDetail);
      }
      // 自定义按钮
      if (handleColumns) {
        const tmpHandleColumns: any = [];
        handleColumns.forEach((item: any) => {
          let { display = false } = item;
          if (typeof display === 'string') {
            display = func[item.display](record);
          }
          if (!display) {
            tmpHandleColumns.push(item);
          }
        });
        tmpHandleColumns.forEach((item: any, index: number) => {
          const funParam: any = {
            record,
            ...param,
          };
          const funcName = 'getOtherRef';
          let otherRef: any;
          if (func[funcName]) {
            otherRef = func[funcName]();
            funParam.otherRef = otherRef;
          }
          // 自定义按钮是否可用
          let { disabled = false } = item;
          if (typeof disabled === 'string') {
            if (func && func[item.disabled]) {
              disabled = func[item.disabled](record);
            } else if (customerBuss && customerBuss[item.disabled]) {
              disabled = customerBuss[item.disabled](record);
            }
          }
          handleEle.push(<Fragment key={index.toString()}>
            <Button type='link' size='small' className={item.key} disabled={disabled} onClick={(event: any) => {
              if (item?.func === 'C_ACT_BPM') {
                // 通用的业务处理文件，..../DDAssist/util/customerBuss.tsx
                customerBuss['cActBpm'](funParam, event, unitKey);
              } else {
                if (item?.func && func[item.func]) {
                  func[item.func](funParam, event);
                } else if (item?.func && customerBuss[item.func]) {
                  // 通用的业务处理文件，仅为简单调用..../DDAssist/util/customerBuss.tsx
                  customerBuss[item.func](funParam, event);
                } else {
                  message.info('function undefined');
                }
              }
            }}>{item.name}</Button>
          </Fragment>);
        });
      }
      return <Space size={0}>{handleEle}</Space>;
    }
  },
  // 列选择
  initRowSelection: ({
    selectionType,
    selectionRowKeys,
    ...otherProps // (onChange/onSelect/onSelectAll)
  }: any) => {
    if (!selectionType) {
      return {};
    }
    const rowSelection = {
      selectedRowKeys: selectionRowKeys,
      type: selectionType,
      fixed: true,
      ...otherProps,
    };
    return { rowSelection };
  },
  // 主键是联合主键时获取ywKey 默认___拼接
  getYwKey: (record: any, rowKey: any) => {
    const tmp: any = [];
    if (Array.isArray(rowKey)) {
      rowKey.forEach((item: any) => {
        tmp.push(record[item]);
      });
    } else {
      tmp.push(record[rowKey]);
    }
    return tmp.join('___');
  },
  // 行事件: 单击双击选中事件
  clickCheckedToggle: (param: any) => {
    const { record, selectionRows, selectionRowKeys, setSelectionRowKeys, setSelectionRows, config } = param;
    const rowKey = config?.grid_row_key !== undefined ? config?.grid_row_key : param.rowKey
    const existRow: any = selectionRows.find((item: any) => {
      return tableUtil.getYwKey(item, rowKey) === tableUtil.getYwKey(record, rowKey);
    });
    if (existRow) {
      // 删除
      const newSelectionRowKeys = selectionRowKeys.filter((item: any) => {
        return item !== tableUtil.getYwKey(record, rowKey);
      });
      const newSelectionRows = selectionRows.filter((item: any) => {
        return tableUtil.getYwKey(item, rowKey) !== tableUtil.getYwKey(record, rowKey);
      });
      setSelectionRowKeys([].concat(newSelectionRowKeys));
      setSelectionRows([].concat(newSelectionRows));
    } else {
      // 添加
      selectionRowKeys.push(tableUtil.getYwKey(record, rowKey));
      selectionRows.push(record);
      setSelectionRowKeys([].concat(selectionRowKeys));
      setSelectionRows([].concat(selectionRows));
    }
  },
  // 行事件: 单击行
  rowClick: (param: any) => {
    const { func, config } = param;
    const gridClickChecked = config?.grid_click_checked !== undefined ? config?.grid_click_checked : param?.gridClickChecked;
    if (gridClickChecked === '1') {
      tableUtil.clickCheckedToggle(param);
    }
    // 执行自定义行单击事件
    if (func.gridOnRowClick) {
      func.gridOnRowClick(param);
    }
  },
  // 行事件: 双击行
  rowDoubleClick: (param: any) => {
    const { func, config } = param;
    const gridClickChecked = config?.grid_click_checked !== undefined ? config?.grid_click_checked : param?.gridClickChecked;
    if (gridClickChecked === '2') {
      tableUtil.clickCheckedToggle(param);
    }
    // 执行自定义行双击事件
    if (func.gridOnRowDoubleClick) {
      func.gridOnRowDoubleClick(param);
    }
  },
  // 行事件
  initOnRow: (param: any) => {
    return (record: any) => {
      return {
        onClick: (event: any) => {
          tableUtil.rowClick({ record, event, ...param });
        },
        onDoubleClick: (event: any) => {
          tableUtil.rowDoubleClick({ record, event, ...param });
        },
      };
    }
  },
  // 判断列表里面是否有合计
  isSum(columns: any[]) {
    let flagSum = false;
    columns.forEach((data: any) => {
      if (data.children && data.children.length > 0) {
        tableUtil.isSum(data.children)
      } else if (data.sum) {
        flagSum = true;
      }
    });
    return flagSum;
  },
};

export default tableUtil;
