import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({ open, onCancel, onConfirm, title = 'Confirm', message = 'Are you sure?' }) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Confirm</Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
