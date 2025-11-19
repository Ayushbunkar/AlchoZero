import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({ open, onCancel, onConfirm, title = 'Confirm', message = 'Are you sure?', confirmText = 'Confirm', loading = false }) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : confirmText}</Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
