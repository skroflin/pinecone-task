import { useState } from "react";
import {
  Input,
  Button,
  Form,
  Message,
  Dropdown,
  Container,
} from "semantic-ui-react";
import { insertNode, NodeInsertReq } from "../utils/api";
import "./style.css";

interface NodeInputProps {
  parentNodeId: string | null;
  existingNodes: { id: string; title: string }[];
  onNodeAdded: (newNode: Node) => void;
}

export default function NodeInput({
  parentNodeId,
  existingNodes,
  onNodeAdded,
}: NodeInputProps) {
  const [title, setTitle] = useState("");
  const [ordering, setOrdering] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParentNode, setSelectedParentNode] = useState<string | null>(
    parentNodeId
  );

  const handleSubmit = async () => {
    if (title.trim() === "") {
      setError("Title cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    const newNode: NodeInsertReq = {
      title: title,
      parentNodeId: selectedParentNode || "",
      ordering: ordering,
    };

    try {
      const createdNode: Node = await insertNode(newNode);
      onNodeAdded(createdNode);
      setTitle("");
      setOrdering(0);
      setSelectedParentNode(null);
    } catch (e) {
      console.log("Adding new node failed", e);
      setError("Failed to add node");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="node-add-container-prop">
      <Form onSubmit={handleSubmit} loading={loading} error={!!error}>
        <Form.Field>
          <Input
            placeholder="Enter node title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            type="number"
            placeholder="Enter ordering"
            value={ordering}
            onChange={(e) => setOrdering(Number(e.target.value))}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Select Parent Node"
            fluid
            selection
            options={existingNodes.map((node) => ({
              key: node.id,
              text: node.title,
              value: node.id,
            }))}
            value={selectedParentNode}
            onChange={(_e, { value }) => setSelectedParentNode(value as string)}
          />
        </Form.Field>
        <Container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button type="submit" color="blue" icon="add" content="Add Node" />
        </Container>
        {error && (
          <Container textAlign="center" style={{ paddingTop: "10px" }}>
            <Message negative>{error}</Message>
          </Container>
        )}
      </Form>
    </Container>
  );
}
