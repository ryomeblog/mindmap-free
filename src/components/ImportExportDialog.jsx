import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const ImportExportDialog = ({ open, onClose, mode, data, onImport }) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      alert('クリップボードにコピーしました');
    } catch (err) {
      console.error('クリップボードへのコピーに失敗:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setError('データを入力してください');
      return;
    }
    onImport(importText);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'export' ? 'データのエクスポート' : 'データのインポート'}
      </DialogTitle>
      <DialogContent>
        {mode === 'export' ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={data}
              InputProps={{ readOnly: true }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Tooltip title="クリップボードにコピー">
                <IconButton onClick={handleCopyToClipboard}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="ファイルとしてダウンロード">
                <IconButton onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder="エクスポートされたデータを貼り付けてください"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        {mode === 'import' && (
          <Button onClick={handleImport} variant="contained">
            インポート
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportExportDialog;