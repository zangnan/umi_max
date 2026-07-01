import { Button, Form, Input, message, Modal, Spin } from "antd";
import { useImperativeHandle, useState } from "react";
import CONSTANTS from '@/components/DDAssist/constants';
import { ExclamationCircleFilled } from "@ant-design/icons";
import style from './style.less';
import { bgdToCkxxcx, getBgdCkxxcxSsqSbpc, queryPager, queryCjCsh, checkSsqPcYsb } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
    onRef?: any;
    visible?: any;
}

const ScxxcxDialog: React.FC<DDTsort> = ({ onRef, visible = false }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(visible);
    const [form] = Form.useForm();
    const [modalTile, setModalTile] = useState<any>('生成出口明细');
    const [masker, setMasker] = useState<boolean>(false);
    const [paramValue, setParamValue] = useState<any>({});
    // const [lastSsq, setLastSsq] = useState<any>();

    // 开启
    const showModal = (param: any) => {
        setModalVisible(true);
        setParamValue(param)
        setModalTile('生成信息查询')
        getMaxSbpcBySsq(null)
        // setLastSsq(null)
    };

    // 关闭
    const closeModal = () =>{
        setModalVisible(false);
        form.resetFields();
        // setLastSsq(null)
    }

    useImperativeHandle(onRef, () => {
        return {
            showModal,
        };
    });

    // 根据所属期获取最大申报批次
    const getMaxSbpcBySsq = (param: any) => {
        // let ssq = ''
        // if (param !== null) {
        //     ssq = param.target.value
        // } else {
        //     ssq = getNowSsq()
        // }
        // if (ssq == '' || ssq == null) {
        //     ssq = getNowSsq()
        // }
        // 与上次相同则不修改
        // if (lastSsq == ssq) {
        //     return
        // }
        // 初始化信息
        // getBgdCkxxcxSsqSbpc({ ssq: ssq }).then((res: any) => {
        //     const { code, msg, body } = res;
        //     if (code === '200') {
        //         form.setFieldsValue({ ssq: ssq, sbpc: body.sbpc })
        //         setLastSsq(ssq)
        //     } else {
        //         message.error(msg)
        //     }
        // })
        const obj = {
            lcswsxDm: "",
            tableKey: "QTYW_ZXSB_SB_CKXXCX_G"
        }
        queryCjCsh(obj).then((res: any) => {
            const { code, msg, body } = res;
            if (code === '200') {
                form.setFieldsValue({ ssq: body.ssq, sbpc: body.sbpc })
                // setLastSsq(body.ssq)
            } else {
                message.error(msg)
            }
        })
    }

    // 获取当前所属期-1
    // const getNowSsq = () => {
    //     const sj = new Date();
    //     let defTime: any;
    //     const month = (sj.getMonth() + 1) < 10 ? '0' + sj.getMonth() : sj.getMonth();
    //     if(sj.getMonth() === 0) {
    //         const year = sj.getFullYear() - 1;
    //         defTime = String(year) + 12;
    //     } else {
    //         defTime = String(sj.getFullYear()) + month;
    //     }
    //     return defTime
    // }

    // 确认生成明细
    const save = () => {
        form.validateFields().then(values => {
            
            if (paramValue.selectionRowKeys.length === 0) {
                const searchModel = paramValue.unitRef.current?.getGridParams().searchModel || [];
                const headerSearchModel = paramValue.gridRef.current?.getHeaderFilter() || [];
                const allSearchModel: any = searchModel.concat(headerSearchModel);
                allSearchModel.push({ property: 'cxlx', value: '5', op: 'zdy' });
                allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
                // 走获取全部uuid的接口 
                const obj = {
                    page: 1,
                    pageSize: 999999,
                    key: 'WBSJ_CKBGD_QUERY_PAGE',
                    searchModel: allSearchModel,
                }
                setMasker(true);
                queryPager(obj).then((res: any) => {
                    setMasker(false);
                    const { code, body, msg } = res;
                    if (code === '200') {
                        bgdToCkxxcxApi(body.rows, paramValue.unitRef);
                    } else {
                        message.error(msg)
                    }
                })
            } else {
                bgdToCkxxcxApi(paramValue.selectionRowKeys, paramValue.unitRef);
            }
        })
    }


    // 生成信息查询接口
    const bgdToCkxxcxApi = (param: any, unitRef: any) => {
        const obj = {
            sbpc: form.getFieldValue("sbpc"),
            ssq: form.getFieldValue("ssq"),
            tableKey: "QTYW_ZXSB_SB_CKXXCX_G",
        }
        setMasker(true);
        checkSsqPcYsb(obj).then((response: any)=>{
            const { code, msg } = response;
            setMasker(false);
            if(code === '200') {
                setMasker(true);
                bgdToCkxxcx({
                    ssq: form.getFieldValue("ssq"),
                    sbpc: form.getFieldValue("sbpc"),
                    bz: form.getFieldValue("bz"),
                    uuids: param
                }).then((res: any) => {
                    setMasker(false);
                    const { code, msg, body } = res;
                    if (code === '200') {
                        setModalVisible(false);
                        message.success(body)
                        unitRef.current!.reload2();
                        unitRef.current?.setSelectionRowKeys([]);
                        unitRef.current?.setSelectionRows([]);
                    } else if(code === '900') {
                        message.error(body);
                    } else {
                        message.error(msg)
                    }
                })
            } else if(code === '900') {
                message.info(msg);
            } else {
                message.error(msg);
            }
        })
      
    }

    const onBlurSbpc = () => {
        const sbpc: any = form.getFieldsValue()?.sbpc;
        if (sbpc && sbpc.length != 3) {
            form.setFieldsValue({sbpc: myUtil.text.leadingZeroize(sbpc, 3)});
        }
    }

    return (
        <Modal
            title={modalTile}
            destroyOnHidden={true}
            open={modalVisible}
            width={CONSTANTS.C_MODAL_WIDTH_X1}
            footer={<>
                <Button onClick={closeModal}>取消</Button>
                <Button onClick={save} type="primary">确认</Button>
            </>}
            onCancel={closeModal}
            className={`${masker ? 'dd_modal_show_masker' : ''}`}
            mask={{ closable: false }}
        >
            <Spin tip="Loading..." spinning={masker} delay={100}>
                <Form
                    form={form}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                >
                    <div className={style.query_info}>
                        <ExclamationCircleFilled style={{ color: '#1890ff', fontSize: '21px' }} />
                        <span style={{ fontWeight: "bold", marginLeft: '10px' }}>请确认填补以下信息：</span>
                    </div>
                    <Form.Item label="所属期" name="ssq" rules={[{ required: true, message: '申报年月为必录' },
                    () => ({
                        validator(_, value) {
                            if (value) {
                                const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                                if (temp1) {
                                    return Promise.reject(new Error('请输入正确的格式'));
                                }
                                return Promise.resolve();
                            }
                            return Promise.resolve();
                        },
                    })
                    ]} >
                        <Input placeholder="请输入6位申报年月" style={{ width: 230 }}></Input>
                    </Form.Item>
                    <Form.Item label="申报批次" name="sbpc" rules={[{ required: true, message: '申报批次为必录' },
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    const temp1 = (!value.match(/^\d{0,3}$/));
                                    if (temp1) {
                                        return Promise.reject(new Error('只能输入0-3位数字'));
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}>
                        <Input placeholder="请输入申报批次" style={{width: 230}} maxLength={3} onBlur={onBlurSbpc} ></Input>
                    </Form.Item>
                    <Form.Item label="备注" name="bz" rules={[baseValidator.range2({ min: 0, max: 200 })]} >
                        <Input placeholder="请输入备注" style={{ width: 230 }}></Input>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
export default ScxxcxDialog;