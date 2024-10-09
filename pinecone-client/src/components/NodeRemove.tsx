import { Button, ButtonContent, Icon, Message } from "semantic-ui-react";
import { deleteNode } from "../utils/api";
import { useState } from "react";

interface NodeRemoveProps {
  nodeId: string;
  onNodeRemoved: (nodeId: string) => void;
}

export default function NodeRemove({ nodeId, onNodeRemoved }: NodeRemoveProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      deleteNode(nodeId);
      onNodeRemoved(nodeId);
    } catch (error) {
      console.error("Error deleting node: ", error);
      setError("Failed to delete node");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      animated="vertical"
      size="small"
      style={{ margin: "3px" }}
      onClick={handleDelete}
      loading={loading}
      error={!!error}
    >
      <ButtonContent hidden>Remove</ButtonContent>
      <ButtonContent visible>
        <Icon name="trash alternate" size="small" />
      </ButtonContent>
      <Message negative>{error}</Message>
    </Button>
  );
}
