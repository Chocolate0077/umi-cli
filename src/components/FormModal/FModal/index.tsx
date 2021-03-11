/**
 * 集中的输出
 */
import { Form } from 'antd';
import type { FModalRefProps as IFModalRefProps } from './FModal';
import FModalInstance from './FModal';

type InternalFModal = typeof FModalInstance;

interface FModalInterface extends InternalFModal {
  FormItem: typeof Form.Item;
}

const FModal = FModalInstance as FModalInterface;

FModal.FormItem = Form.Item;

export type FModalRefProps = IFModalRefProps;

export default FModal;
