/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC, ReactElement } from 'react';
import React, { useCallback, useState } from 'react';
import { Modal, notification, Form } from 'antd';
import type { FormInstance, FormProps } from 'antd/lib/form';
import type { ModalProps } from 'antd/lib/modal';

interface FormModalProps {
  modalOpt?: ModalProps;
  formOpt?: FormProps;
  errorMsg?: string;
  trigger: ReactElement;
  renderFormItem: (form: FormInstance) => ReactElement;
  onSubmit: (values: any) => Promise<void>;
}

/* MC 表单收集Modal */
const FormModal: FC<FormModalProps> = ({
  modalOpt,
  formOpt,
  trigger,
  renderFormItem,
  onSubmit,
  errorMsg,
}) => {
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
        onSubmit(values)
          .then(() => {
            closeModal();
            form.resetFields();
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

  return (
    <>
      <div onClick={showModal}>{trigger}</div>
      <Modal
        width="60%"
        {...modalOpt}
        visible={modalVisible}
        confirmLoading={okButtonLoading}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form {...formOpt} form={form}>
          {renderFormItem(form)}
        </Form>
      </Modal>
    </>
  );
};

export default FormModal;
