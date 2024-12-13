import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import MindMapCanvas from "../components/MindMapCanvas";
import NodeDialog from "../components/NodeDialog";

const MindMapPage = () => {
  const [nodes, setNodes] = useState([]);
  const [openNodeDialog, setOpenNodeDialog] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [parentNodeForNewNode, setParentNodeForNewNode] = useState(null);

  const handleAddNode = (parentNode = null) => {
    setCurrentNode(null);
    setParentNodeForNewNode(parentNode);
    setOpenNodeDialog(true);
  };

  const handleEditNode = (nodeId, updates = {}, isDragging = false) => {
    if (isDragging) {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        )
      );
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );

    if (typeof updates.text !== "undefined") {
      setOpenNodeDialog(false);
    } else {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (targetNode) {
        setCurrentNode(targetNode);
        setOpenNodeDialog(true);
      }
    }
  };

  const calculateNodePosition = (parentNode) => {
    if (!parentNode) {
      return { x: 0, y: 0 }; // キャンバスの中心を原点とする
    }

    const siblings = nodes.filter((n) => n.parentId === parentNode.id);
    const angle = (siblings.length * (Math.PI / 6)) + (Math.PI / 3);
    const distance = 200; // 親ノードからの距離

    return {
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
    };
  };

  const handleSaveNode = (text) => {
    if (currentNode) {
      handleEditNode(currentNode.id, { text });
    } else {
      const position = calculateNodePosition(parentNodeForNewNode);
      const newNode = {
        id: Date.now(),
        text,
        x: position.x,
        y: position.y,
        parentId: parentNodeForNewNode ? parentNodeForNewNode.id : null,
      };
      setNodes([...nodes, newNode]);
      setOpenNodeDialog(false);
      setParentNodeForNewNode(null);
    }
  };

  const handleDeleteNode = (nodeId) => {
    const nodesToDelete = new Set([nodeId]);
    const queue = [nodeId];

    while (queue.length > 0) {
      const currentId = queue.shift();
      nodes
        .filter((n) => n.parentId === currentId)
        .forEach((childNode) => {
          nodesToDelete.add(childNode.id);
          queue.push(childNode.id);
        });
    }

    setNodes(nodes.filter((n) => !nodesToDelete.has(n.id)));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(45deg, #FAFAFA 30%, #F5F5F5 90%)",
        pt: 3,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mind Map Free
          </Typography>

          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "white",
              minHeight: "70vh",
            }}
          >
            <MindMapCanvas
              nodes={nodes}
              onAddNode={handleAddNode}
              onEditNode={handleEditNode}
              onDeleteNode={handleDeleteNode}
              setNodes={setNodes}
            />
          </Box>
        </Paper>

        <NodeDialog
          open={openNodeDialog}
          onClose={() => setOpenNodeDialog(false)}
          currentNode={currentNode}
          onSave={handleSaveNode}
        />

      </Container>
    </Box>
  );
};

export default MindMapPage;