import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField,
  Button
} from '@mui/material';

const NodeDialog = ({ 
  open, 
  onClose, 
  currentNode, 
  onSave 
}) => {
  const handleSave = () => {
    const textInput = document.querySelector('input[type="text"]');
    onSave(textInput.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>
        {currentNode ? 'ノードを編集' : 'ノードを追加'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ノードのテキスト"
          fullWidth
          variant="outlined"
          defaultValue={currentNode ? currentNode.text : ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NodeDialog;