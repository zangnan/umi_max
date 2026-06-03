import DDBaseGrid from "@/components/DDBaseGrid";
import { useImperativeHandle, useState } from "react";
import { Modal, Button, Spin, message } from "antd";
import pro from '@/pages/common/proConfig';
import moment from "moment";
import {commonDrwtdc } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';

export interface DDTsort {
    onRef?: any;
    visible?: any;
}

const CheckErrModel: React.FC<DDTsort> = ({ onRef, visible = false }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(visible);
    const [errData, setErrData] = useState<any>([]); // 退税进度 表格 数据
    const [tagType, setTagType] = useState<any>(); // 页面展示类型
    const [title, setTitle] = useState<any>(); // 标头
    const [importKey, setImportKey] = useState<any>(); // 导出key
    const [masker, setMasker] = useState<any>(false);

    // 开启
    const showModal = (param: any, tagType: any, title:any, key: any) => {
        setErrData(param)
        setTagType(tagType)
        setTitle(title)
        setImportKey(key)
        setModalVisible(true);
    }

    useImperativeHandle(onRef, () => {
        return {
            showModal,
        };
    });

    const handleColumnRenderDate = (text: any) => {
        if (text) {
            return (<span>{moment(new Date(Number(text))).format('YYYY-MM-DD')}</span>)
        } else {
            return (<span></span>)
        }
    }

    const errColumns = () =>  {
        if(tagType === 'ckspDm'){
            return [
                { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, },
                { title: '项号', dataIndex: 'xh4', width: 50, },
                { title: '出口日期', dataIndex: 'ckrq1', width: 110, render: handleColumnRenderDate },
                { title: '修改前商品代码', dataIndex: 'ckspDm', width: 120 },
                { title: '修改后商品代码', dataIndex: 'tzhckspDm', width: 120 },
                { title: '失败原因', dataIndex: 'sbyy',width: 200, ellipsis: true  },
            ]
        } if(tagType === 'dlzm'){
            return [
                { title: '代理出口货物证明号', dataIndex: 'dlckhwzmhm', width: 180, },
                { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, },
                { title: '出口日期', dataIndex: 'ckrq1', width: 110, render: handleColumnRenderDate },
                { title: '修改前商品代码', dataIndex: 'ckspDm', width: 120 },
                { title: '修改后商品代码', dataIndex: 'tzhckspDm', width: 120 },
                { title: '失败原因', dataIndex: 'sbyy',width: 200, ellipsis: true  },
            ]
        } else if(tagType === 'dr'){
            return [
                { title: '失败原因', dataIndex: 'sbyy', ellipsis: true },
                // { title: '原因描述', dataIndex: 'yyms', width: 200, ellipsis: true },
            ]
        } else if( tagType === 'ckxx') {
            return [
                { title: '所属期', dataIndex: 'ssq', width: 100, },
                { title: '申报批次', dataIndex: 'sbpc', width: 100, },
                { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, },
                { title: '项号', dataIndex: 'xh4', width: 50, },
                { title: '失败原因', dataIndex: 'sbyy',width: 200, ellipsis: true  },
            ]
        } else{
            return []
        }
    }

    const dccwxx = () => {
        const params = {key: importKey};
        setMasker(true);
        commonDrwtdc(params).then((response) => {
            setMasker(false);
            if (response.code === '200') {
                const {blob, fileName} = response.body;
                myUtil.file.downloadExcel(blob, fileName);
            } else {
                message.error(response.desc);
            }
        });
    }

    return (
        <>
            <Modal
                title={title}
                destroyOnClose={true}
                visible={modalVisible}
                width={pro.c_modal_width_x4}
                style={{ height: 700 }}
                footer={(<>
                    <Button onClick={() => setModalVisible(false)}>取消</Button>
                    {tagType === 'dr' ? <Button onClick={dccwxx} type="primary">导出</Button> : <></> }
                </>)}
                onCancel={() => setModalVisible(false)}
                maskClosable={false}
            >
                <Spin tip="Loading..." spinning={masker} delay={100}>
                    <DDBaseGrid
                        columns={errColumns()}
                        showSerialNumber
                        userDataSource={errData}
                        pagination={{
                            total: errData.length,
                            pageSize: 10,
                            current: 1,
                        }}
                    />
                </Spin>
            </Modal>
        </>
    )
};

export default CheckErrModel;

