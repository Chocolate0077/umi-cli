/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, forwardRef, useImperativeHandle, Children } from 'react';
import { Modal, notification, Form } from 'antd';
import type { FormInstance, FormProps } from 'antd/lib/form';
import type { ModalProps } from 'antd/lib/modal';
import { get } from 'lodash-es';

export interface FModalRefProps extends FormInstance {
  show: () => void;
  hide: () => void;
}

interface FModalProps {
  modalOpt?: ModalProps;
  formOpt?: FormProps;
  errorMsg?: string;
  children?: any;
  onSubmit?: (values: any) => Promise<any>;
}

/* MC 表单收集Modal */
const FModalInstance = forwardRef<FModalRefProps, FModalProps>(
  ({ modalOpt, formOpt, onSubmit, errorMsg, children }, ref) => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [okButtonLoading, setOkButtonLoading] = useState(false);

    const showModal = useCallback(() => {
      setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
      setModalVisible(false);
    }, []);

    const handleOk = useCallback(() => {
      setOkButtonLoading(true);
      form
        .validateFields()
        .then((values) => {
          onSubmit?.(values)
            .then(() => {
              closeModal();
              setOkButtonLoading(false);
            })
            .catch((error) => {
              notification.error({
                message: errorMsg || '提交表单失败',
                description: `错误信息: ${error.message || error.description || ''}`,
              });
              setOkButtonLoading(false);
            });
        })
        .catch(() => {
          setOkButtonLoading(false);
        });
    }, [closeModal, errorMsg, form, onSubmit]);

    const renderChildren = (form: any) => {
      if (!children) return null;

      return (
        Children.map(children, (child: any) => {
          // 判断是否是 Form.Item 组件， displayName 可能不好使
          if (get(child, 'type.displayName') === 'FormItem' || child.type === Form.Item) {
            return child;
          }
          if (typeof child === 'function') {
            return child(form);
          }
          return null;
        })?.filter((v: any) => v) || null
      );
    };

    useImperativeHandle(ref, () => ({
      show: showModal,
      hide: closeModal,
      ...form,
    }));

    return (
      <Modal
        width="60%"
        {...modalOpt}
        visible={modalVisible}
        confirmLoading={okButtonLoading}
        onOk={handleOk}
        onCancel={closeModal}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Form {...formOpt} form={form}>
          {renderChildren(form)}
        </Form>
      </Modal>
    );
  },
);

export default FModalInstance;
