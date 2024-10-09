import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Message,
  ButtonContent,
  Icon,
} from "semantic-ui-react";
import { updateNode, NodeUpdateReq } from "../utils/api";

interface NodeUpdateProps {
  node: NodeUpdateReq;
  onNodeUpdated: (updatedNode: NodeUpdateReq) => void;
}

export default function NodeUpdate({
  node,
  onNodeUpdated,
}: NodeUpdateProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [updatedNode, setUpdatedNode] = useState<NodeUpdateReq>(node);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUpdatedNode(node);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedNode((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateNode(updatedNode);
      onNodeUpdated(updatedNode);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button animated="vertical" onClick={handleOpen} size="small">
        <ButtonContent hidden>Update</ButtonContent>
        <ButtonContent visible>
          <Icon name="edit" size="small" />
        </ButtonContent>
        <Modal open={open} onClose={handleClose} size="tiny">
          <Modal.Header>Update Node</Modal.Header>
          <Modal.Content>
            <Form>
              {Object.entries(updatedNode).map(([key, value]) => (
                <Form.Field key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                  />
                </Form.Field>
              ))}
            </Form>
            {error && <Message negative>{error}</Message>}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button positive onClick={handleSubmit} loading={loading}>
              Update
            </Button>
          </Modal.Actions>
        </Modal>
      </Button>
    </>
  );
}
