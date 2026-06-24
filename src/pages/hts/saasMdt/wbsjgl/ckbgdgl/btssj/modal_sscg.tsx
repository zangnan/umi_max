import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Spin } from "antd";
import { useImperativeHandle, useState } from "react";
import CONSTANTS from '@/components/DDAssist/constants';
import { CheckCircleFilled } from "@ant-design/icons";
import { btssjJsJxsezce, btssjSsjgdc } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import businessValidator from '@/pages/hts/common/field/businessValidator';


export interface DDTsort {
    onRef?: any;
    visible?: any;
}

const ScxxcxDialog: React.FC<DDTsort> = ({ onRef, visible = false }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(visible);
    const [formData] = Form.useForm();
    const [masker, setMasker] = useState<boolean>(false);
    const [paramValue, setParamValue] = useState<any>({});
    const [mainUnitRef, setMainUnitRef] = useState<any>();
    const [exportKey, setExportKey] = useState<any>(""); // 导出key

    // 开启
    const showModal = (unitRef: any, param: any) => {
        setMainUnitRef(unitRef)
        setParamValue(param)
        getCxss(param, unitRef,'1')
        setExportKey(param?.uuids);
    };

    const getCxss = (obj: any, ref: any,flag:any) => {
        if('2' === flag){
            obj.sfcxjs = 'Y'
        }
        setMasker(true)
        btssjJsJxsezce(obj).then((res: any) => {
            setMasker(false)
            const { code, body, msg } = res;
            if (code === '200') {
                setModalVisible(true);
                if(body.uuids){
                 setExportKey(body.uuids);
                }
                ref.current!.reload2();
                formData.setFieldsValue({
                    bgdts: body?.bgdts,
                    rmblajHj: body?.rmblajHj ? myUtil.text.formatNum(body?.rmblajHj, '0,0.00') : '0.00',
                    myblajHj: body?.myblajHj ? myUtil.text.formatNum(body?.myblajHj, '0,0.00') : '0.00',
                    sssl:obj.sssl,
                    ssjxzcssq:obj.ssjxzcssq
                });
            } else {
                message.error(msg)
            }
        })
    }

    // 关闭
    const closeModal = () => {
        setModalVisible(false);
        formData.resetFields();
    }

    useImperativeHandle(onRef, () => {
        return {
            showModal,
        };
    });

    // 重新试算
    const tryAgain = async () => {
        const pv = {...paramValue};
        pv.uuids = exportKey;
        const fv = await formData.validateFields();
        setModalVisible(false);
        pv.sssl = fv.sssl;
        pv.ssjxzcssq= fv.ssjxzcssq;
        setParamValue(pv);
        getCxss(pv, mainUnitRef,'2');
    }

    const exportModal = async () => {
        setMasker(true);
        btssjSsjgdc({ uuids: exportKey }).then((response) => {
            setMasker(false);
            const { code, body, desc } = response;
            if (code === '200') {
                const { blob, fileName } = body;
                message.success('导出成功！');
                myUtil.file.downloadExcel(blob, fileName);
            } else {
                message.error(desc);
            }
        });
    };

    return (
        <Modal
            title="试算进项税额转出额"
            destroyOnHidden={true}
            visible={modalVisible}
            width={CONSTANTS.C_MODAL_WIDTH_X2}
            footer={<>
                <Button onClick={exportModal}>导出</Button>
                <Button onClick={tryAgain}>重新试算</Button>
                <Button onClick={closeModal} type="primary">确定</Button>
            </>}
            onCancel={closeModal}
            className={`${masker ? 'dd_modal_show_masker' : ''}`}
            mask={{ closable: false }}
        >
            <Spin tip="Loading..." spinning={masker} delay={100}>
                <Form
                    form={formData}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 9 }}
                >
                    <div style={{ fontSize: '17px', textAlign: 'center', marginBottom: '30px' }}>
                        <CheckCircleFilled style={{ color: '#52C41A', fontSize: '21px' }} />
                        <span style={{ fontWeight: "bold", marginLeft: '10px' }}>试算进项税额转出额成功！</span>
                    </div>
                    <Form.Item label="报关单条数" name="bgdts">
                        <Input disabled></Input>
                    </Form.Item>
                    <Form.Item label="人民币离岸价总额" name="rmblajHj">
                        <Input disabled></Input>
                    </Form.Item>
                    <Form.Item  label="试算税率" name="sssl" rules={[{ required: true, message: '请输入试算税率' },{ type: 'base_number', range: '+'}]}>
                        <Input placeholder='试算税率' />
                    </Form.Item>
                    <Form.Item  label="试算进项转出所属期" name="ssjxzcssq" rules={[{ required: true, message: '请输入试算进项转出所属期' },businessValidator.ssq03()]} >
                        <Input placeholder='试算进项转出所属期' />
                    </Form.Item>
                    <Form.Item label="试算进项税额转出总额" name="myblajHj">
                        <Input disabled></Input>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
export default ScxxcxDialog;