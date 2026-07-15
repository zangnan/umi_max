import cktsUtil from '@/pages/hts/cktsUtil';
import { Button, Form, Input, message, Modal, Select, Spin, Tag } from "antd";
import { useImperativeHandle, useState } from "react";
import CONSTANTS from '@/components/DDAssist/constants';
import { ExclamationCircleFilled } from "@ant-design/icons";
import style from './style.less';
import myUtil from '@/components/DDAssist/util';
import { bgdscCkmx, checkSsqYsbCj, queryCjCsh, queryPager } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';

export interface DDTsort {
    onRef?: any;
    visible?: any;
}

const ScmxSaasMdt: React.FC<DDTsort> = ({ onRef, visible = false }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(visible);
    const [form] = Form.useForm();
    const [modalTile, setModalTile] = useState<any>('生成明细');
    const [masker, setMasker] = useState<boolean>(false);
    const [ywlxdm, setYwlxDm] = useState<any>([]);
    const [gnqyfs, setGnqyfs] = useState<any>([]);
    const [hgzsrzqylx, setHgzsrzqylx] = useState<any>([]);
    const [paramValue, setParamValue] = useState<any>({});

    const [qygts, setQygts] = useState<boolean>(false);
    const [ywlx, setYwlx] = useState<any>();
    const [cxlx, setCxlx] = useState<any>();

    // 开启
    const showModal = (param: any, type: any) => {
        // 初始化页面参数
        setModalVisible(true);
        const unit_key = param?.unitKey;
        setParamValue(param)
        if (unit_key.includes('WBSJ_CKBGD')) {
            setModalTile('生成明细报表');
            setYwlx("ckbgd");
        }
        if (unit_key.includes('CX_SAAS_MDT_DLCKHWZMGL')) {
            setModalTile('生成明细报表');
            setYwlx("dlckhwzm");
        }
        setCxlx(type)
        setQygts(false);

        //  初始化码表
        let codekey = cktsUtil.sys.enterpriseType().toUpperCase() === "WM" ? "06" : "09"
        Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx', codekey),
        myUtil.code.getCodeFromServerT1('code_dm_ckts_gnqyfs:01'),
        myUtil.code.getCodeFromServerT1('code_dm_ckts_hgzsrzqylx:01'),]).then(() => {
        }).catch(() => {
            message.error('获取码表失败');
        }).finally(() => {
            if (ywlxdm.length == 0) {
                setYwlxDm(myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', codekey));
            }
            if (gnqyfs.length == 0) {
                setGnqyfs(myUtil.code.getSelectOption('code_dm_ckts_gnqyfs', '01'));
            }
            if (hgzsrzqylx.length == 0) {
                setHgzsrzqylx(myUtil.code.getSelectOption('code_dm_ckts_hgzsrzqylx', '01'));
            }
        })

        // 初始化表单参数
        getInitParam();
    };

    // 关闭
    const closeModal = () =>{
        setModalVisible(false);
        form.resetFields();
    }

    useImperativeHandle(onRef, () => {
        return {
            showModal,
        };
    });

    // 获取默认参数
    const getInitParam = () => {
        //请求默认参数
        var obj = { "tableKey": "MDT_ZXSB_SB_MDT_TSSB_G" };
        queryCjCsh(obj).then((res: any) => {
            const { code, body, desc } = res;
            if (code == '200') {
                form.setFieldsValue({ ssq: body.ssq })
            } else {
                message.error(desc)
            }
        });
    }

    // 校验所属期是否申报
    const checkSsq = (param: any) => {
        checkSsqYsbCj({
            ssq: param,
            tableKey: "MDT_ZXSB_SB_MDT_TSSB_G",
            cdDm: '25020103'
        }).then((res: any) => {
            if (res.code === '900') {
                return Promise.reject(new Error(myUtil.intl2.formatMessage({ id: 'validator_ssq_01' })));
            }
            return Promise.resolve();
        }).catch((err) => {
            return Promise.reject(err);
        });
        return Promise.resolve();
    }

    // 选择业务类型代码
    const checkYwlxdm = (obj: [any]) => {
        if (obj.length > 0) {
            var ywlxmc = "";
            obj.forEach(element => {
                var name = "";
                ywlxdm.forEach((item: any) => {
                    if (item.value == element) {
                        name = item.name;
                    }
                });
                if (ywlxmc.length > 0) {
                    ywlxmc = ywlxmc + ',' + name
                } else {
                    ywlxmc = name
                }
            });
            form.setFieldsValue({ cktmsywlxmcjh: ywlxmc })
        } else {
            form.setFieldsValue({ cktmsywlxmcjh: "" })
        }
        // 判断是否包含启运港退税
        if (obj.includes('QYGTS')) {
            setQygts(true);
        } else {
            setQygts(false);
        }
    }

    // 确认生成明细
    const save = () => {
        form.validateFields().then(() => {
            if (paramValue.selectionRowKeys.length === 0) {
                const searchModel = paramValue.refUnit.current?.getGridParams().searchModel || [];
                const headerSearchModel = paramValue.param.refGrid.current?.getHeaderFilter() || [];
                const allSearchModel: any = searchModel.concat(headerSearchModel);
                allSearchModel.push({ property: 'cxlx', value: cxlx, op: 'zdy' });
                allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
                allSearchModel.push({ property: 'cdDm', value: "25020103", op: 'zdy' });
                if (cxlx === '7') {
                    allSearchModel.push({ property: 'bgdcllxDm', value: "1", op: 'zdy' });
                }
                // 走获取全部uuid的接口
                const obj = {
                    page: 1,
                    pageSize: 999999,
                    key: paramValue?.unit_key,
                    searchModel: allSearchModel,
                }
                setMasker(true);
                queryPager(obj).then((res: any) => {
                    setMasker(false);
                    const { code, body, msg } = res;
                    if (code === '200') {
                        bgdscCkmxApi(body.rows);
                    } else {
                        message.error(msg)
                    }
                })
            } else {
                bgdscCkmxApi(paramValue.selectionRowKeys);
            }
        })
    }


    const bgdscCkmxApi = (param: any) => {
        form.setFieldsValue({ uuids: param, ywlx: ywlx, cdDm: '25020103' })
        setMasker(true)
        bgdscCkmx(form.getFieldsValue(true)).then((res: any) => {
            setMasker(false)
            const { code, msg } = res;
            if (code === '200') {
                message.success(msg)
                setModalVisible(false);
                paramValue?.refUnit.current!.reload();
                form.resetFields();
            } else {
                message.error(msg)
            }
        })
    }

    const tagRender = (props: any) => {
        return <Tag>{props?.value}</Tag>
    }

    return (
        <Modal
            title={modalTile}
            destroyOnHidden={true}
            open={modalVisible}
            width={CONSTANTS.C_MODAL_WIDTH_X2}
            footer={<>
                <Button onClick={closeModal}>取消</Button>
                <Button onClick={save} type="primary">确认生成</Button>
            </>}
            onCancel={closeModal}
            className={`${masker ? 'dd_modal_show_masker' : ''}`}
            mask={{ closable: false }}
        >
            <Spin tip="Loading..." spinning={masker} delay={100}>
                <Form
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}>
                    <div className={style.query_info}>
                        <ExclamationCircleFilled style={{ color: '#1890ff', fontSize: '21px' }} />
                        <span style={{ fontWeight: "bold", marginLeft: '10px' }}>请确认填补以下信息：</span>
                    </div>
                    <Form.Item label="所属期" name="ssq" rules={[{ required: true, message: '请输入6位申报年月' },
                    () => ({
                        validator(_, value) {
                            if (value) {
                                const temp1 = (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/)); // YYYYMM
                                if (temp1) {
                                    return Promise.reject(new Error('请输入正确的格式'));
                                }
                                return checkSsq(value)
                            }
                            return Promise.resolve();
                        },
                    })
                    ]} >
                        <Input placeholder="请输入6位申报年月" style={{ width: 330 }}></Input>
                    </Form.Item>
                    <Form.Item label="业务类型代码" name="cktmsywlxdmjh" rules={[
                        () => ({
                            validator(_, value) {
                                if (value === '' || value === null || value === undefined) {
                                    return Promise.resolve();
                                }
                                if (value.length > 3) {
                                    return Promise.reject(new Error('最多选择三种业务类型'));
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}>
                        <Select style={{ width: 330 }} mode="multiple" maxTagCount={3}
                        placeholder="请选择业务类型" onChange={checkYwlxdm} showArrow  tagRender={tagRender}
                        >
                        {ywlxdm.map((item: any) => {
                            return <Select.Option key={item.value} value={item.value}>{`[${item.value}]${item.name}`}</Select.Option>
                        })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="业务类型名称" name="cktmsywlxmcjh" >
                        <Input style={{ width: 330 }} disabled={true}></Input>
                    </Form.Item>
                    <Form.Item label="国内启运方式" name="gnqyfsDm" rules={[{ required: qygts, message: "当“业务类型代码”选择“QYGTS”时，不能为空" }]}>
                        <Select style={{ width: 330 }} placeholder="请选择国内启运方式" allowClear>
                            {gnqyfs.map((item: any) => {
                                return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="海关总署认证企业类型" name="hgzsrzqylxDm" rules={[{ required: qygts, message: "当“业务类型代码”选择“QYGTS”时，不能为空" }]}>
                        <Select style={{ width: 330 }} placeholder="请选择海关总署认证企业类型" allowClear>
                            {hgzsrzqylx.map((item: any) => {
                                return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="备注" name="bz" rules={[baseValidator.range2({ min: 0, max: 200 })]}>
                        <Input style={{ width: 330 }} placeholder="请输入备注"></Input>
                    </Form.Item>
                    <Form.Item label="主键集合" name="uudis" hidden>
                        <Input hidden></Input>
                    </Form.Item>
                    <Form.Item label="业务类型" name="ywlx" hidden>
                        <Input hidden ></Input>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
export default ScmxSaasMdt;
