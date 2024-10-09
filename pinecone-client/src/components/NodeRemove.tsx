import { useState } from "react";
import {
  Button,
  ButtonContent,
  Container,
  Icon,
  Message,
} from "semantic-ui-react";
import { deleteNode } from "../utils/api";

interface NodeRemoveProps {
  nodeId: string;
  onNodeRemoved: (nodeId: string) => void;
}

export default function NodeRemove({ nodeId, onNodeRemoved }: NodeRemoveProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteNode(nodeId);
      onNodeRemoved(nodeId);
    } catch (error) {
      console.error("Error deleting node: ", error);
      setError(error.message || "Failed to delete node");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        animated="vertical"
        size="small"
        style={{ margin: "3px" }}
        onClick={handleDelete}
        loading={loading}
        disabled={loading}
      >
        <ButtonContent hidden>Remove</ButtonContent>
        <ButtonContent visible>
          <Icon name="trash alternate" size="small" />
        </ButtonContent>
      </Button>
      {error && (
        <div
          style={{
            float: "right",
          }}
        >
          <Message negative>{error}</Message>
        </div>
      )}
    </div>
  );
}
