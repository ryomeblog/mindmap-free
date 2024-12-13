import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  LockResetSharp as ResetIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import ImportExportDialog from "./ImportExportDialog";
import { compressData, decompressData } from "../utils/compression";

const MindMapCanvas = ({
  nodes,
  onAddNode,
  onEditNode,
  onDeleteNode,
  setNodes,
}) => {
  const [zoom, setZoom] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  const [importExportDialog, setImportExportDialog] = useState({
    open: false,
    mode: null,
  });
  const canvasRef = useRef(null);

  const NodeContent = ({ node, onEditNode, onAddNode, onDeleteNode }) => {
    const handleIconClick = (e, action) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("アイコンがクリックされました");
      action();
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: { xs: "4px", sm: "8px" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            padding: { xs: "4px", sm: "8px" },
            width: "100%",
            textAlign: "center",
            cursor: "move", // ここを変更
            wordBreak: "break-word",
            minHeight: { xs: "30px", sm: "40px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {node.text}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            mt: { xs: 0.5, sm: 1 },
            "& .MuiIconButton-root": {
              padding: { xs: "4px", sm: "8px" },
            },
          }}
        >
          <Tooltip title="Add Child">
            <IconButton
              size="small"
              onClick={(e) => handleIconClick(e, () => onAddNode(node))}
              sx={{
                color: "white",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => handleIconClick(e, () => onEditNode(node.id))}
              sx={{
                color: "white",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => handleIconClick(e, () => onDeleteNode(node.id))}
              sx={{
                color: "white",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  // ノード間の接続線を描画するコンポーネントを修正
  const NodeConnections = () => {
    const canvasSize = calculateCanvasSize();

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: canvasSize.width,
          height: canvasSize.height,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {nodes
          .filter((node) => node.parentId)
          .map((node) => {
            const parentNode = nodes.find((n) => n.id === node.parentId);
            if (!parentNode) return null;

            // ノードの中心点を計算
            const startX = parentNode.x + 90;
            const startY = parentNode.y + 50;
            const endX = node.x + 90;
            const endY = node.y + 50;

            return (
              <g key={`connection-${node.id}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(255, 107, 107, 0.6)"
                  strokeWidth="4"
                  strokeDasharray="5,5"
                />
              </g>
            );
          })}
      </svg>
    );
  };

  // インポート処理
  const handleImport = (compressedData) => {
    try {
      const importedData = decompressData(compressedData);
      if (!importedData || !Array.isArray(importedData)) {
        throw new Error("無効なデータ形式です");
      }
      setNodes(importedData);
      setImportExportDialog({ open: false, mode: null });
    } catch (error) {
      alert("インポートに失敗しました: " + error.message);
    }
  };

  // エクスポート処理
  const handleExport = () => {
    try {
      setImportExportDialog({
        open: true,
        mode: "export",
      });
    } catch (error) {
      alert("エクスポートに失敗しました: " + error.message);
    }
  };

  const getTextWidth = (text) => {
    return [...text].reduce((acc, char) => {
      // eslint-disable-next-line no-control-regex
      if (char.match(/[^\x01-\x7E\xA1-\xDF]/)) {
        return acc + 2;
      }
      return acc + 1;
    }, 0);
  };

  // SVGのサイズを計算する関数を追加
  const calculateCanvasSize = () => {
    if (nodes.length === 0) return { width: "100%", height: "100%" };

    const maxX = Math.max(...nodes.map((node) => node.x)) + 300;
    const maxY = Math.max(...nodes.map((node) => node.y)) + 300;

    return {
      width: Math.max(maxX, window.innerWidth),
      height: Math.max(maxY, window.innerHeight),
    };
  };

  const handleZoom = (newZoom) => {
    setZoom(Math.max(0.5, Math.min(newZoom, 2)));
  };

  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      console.log("キャンバスのドラッグを開始しました");
      setIsDragging(true);
      setDragStart({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomLevels = [
        0.5, 0.54, 0.58, 0.62, 0.66, 0.7, 0.8, 0.9, 1.0, 1.3, 1.6, 2.0,
      ];
      console.log("e.deltaY:", e.deltaY);
      const delta = e.deltaY > 0 ? -1 : 1;
      const newIndex = Math.max(
        0,
        Math.min(zoomLevel + delta, zoomLevels.length - 1)
      );
      setZoom(zoomLevels[newIndex]);
      setZoomLevel(newIndex);
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (e.target.closest(".MuiIconButton-root")) {
      console.log("アイコンボタン内でのクリックは無視します");
      return;
    }
    console.log("ノードのドラッグを開始しました");
    setDraggedNode(node);

    // ズームレベルを考慮したオフセット計算
    const rect = canvasRef.current.getBoundingClientRect();
    setNodeOffset({
      x: e.clientX - (node.x * zoom + rect.left),
      y: e.clientY - (node.y * zoom + rect.top),
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      console.log("キャンバスをドラッグ中です");
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggedNode) {
      console.log("ノードをドラッグ中です");
      // ズームレベルとオフセットを考慮した座標計算
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - nodeOffset.x) / zoom;
      const y = (e.clientY - rect.top - nodeOffset.y) / zoom;
      onEditNode(draggedNode.id, { x, y }, true);
    }
  };

  const handleMouseUp = () => {
    console.log("ドラッグを終了しました");
    setIsDragging(false);
    setDraggedNode(null);
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [zoom]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        height: { xs: "calc(100vh - 100px)", sm: "80vh" },
        overflow: "hidden",
        background: "linear-gradient(45deg, #FFDEE9 0%, #B5FFFC 100%)",
        borderRadius: { xs: "8px", sm: "16px" },
      }}
    >
      {/* インポート/エクスポートボタン */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 16 },
          left: { xs: 8, sm: 16 },
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        <Tooltip title="インポート">
          <IconButton
            onClick={() =>
              setImportExportDialog({ open: true, mode: "import" })
            }
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            <ImportIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="エクスポート">
          <IconButton
            onClick={handleExport}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            <ExportIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Zoom Controls */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          "& .MuiIconButton-root": {
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
          },
        }}
      >
        <Tooltip title="Zoom In">
          <IconButton
            color="primary"
            onClick={() => handleZoom(zoom + 0.2)}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton
            color="primary"
            onClick={() => handleZoom(zoom - 0.2)}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset View">
          <IconButton
            color="primary"
            onClick={resetView}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Canvas Area */}
      <Box
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: "center center",
          touchAction: "none",
        }}
      >
        {/* Node Connections SVG */}
        <NodeConnections />

        {/* Nodes */}
        {nodes.map((node) => {
          // テキストの長さに基づいて幅を計算
          const minWidth = 180;
          // ノードのレンダリング部分で使用
          const width = Math.max(minWidth, getTextWidth(node.text) * 12);

          return (
            <Paper
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              elevation={4}
              sx={{
                position: "absolute",
                width: `${width}px`,
                minHeight: "100px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
                color: "white",
                cursor: "move",
                transform: `translate(${node.x}px, ${node.y}px)`,
                "&:hover": {
                  transform: `translate(${node.x}px, ${node.y}px) scale(1.05)`,
                },
              }}
            >
              <NodeContent
                node={node}
                onEditNode={onEditNode}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
              />
            </Paper>
          );
        })}
      </Box>

      {/* Add Root Node Button - キャンバスの外に配置 */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="ルートノードを追加">
          <IconButton
            color="primary"
            onClick={() => onAddNode()}
            sx={{
              background: "linear-gradient(135deg, #1e90ff 0%, #4169e1 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #4169e1 0%, #1e90ff 100%)",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ImportExportDialog */}
      <ImportExportDialog
        open={importExportDialog.open}
        mode={importExportDialog.mode}
        data={importExportDialog.mode === "export" ? compressData(nodes) : ""}
        onClose={() => setImportExportDialog({ open: false, mode: null })}
        onImport={handleImport}
      />
    </Paper>
  );
};

export default MindMapCanvas;
