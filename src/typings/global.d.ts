declare enum DeleteEnum {
  DELETEED = 'YES',
  NOTDELETE = 'NO',
}

declare enum UserStatusEnum {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

// proTable actionRef
interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  reset: () => void;
  clearSelected?: () => void;
  startEditable: (rowKey: any) => boolean;
  cancelEditable: (rowKey: any) => boolean;
}

// 将表格 width 和 editable 设置为必选
interface ProColumnsCustom {
  width: number;
  editable: boolean | undefined | ((text: any, row: any) => boolean);
}
