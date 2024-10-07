import { useEffect, useState } from "react";
import { getNodes } from "../utils/api";
import { List, Loader, Message, Icon, Container } from "semantic-ui-react";
import NodeInput from "./NodeAdd";
import "./style.css";

interface Node {
  id: string;
  title: string;
  parent_node_id: string | null;
  ordering: number;
}

export default function TreeView() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const data = await getNodes();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setNodes(data);
      } catch (e) {
        console.error("Fetch error: ", e);
        setError(e.message || "Failed to load nodes");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  if (loading)
    return (
      <Loader active inline="centered">
        Loading...
      </Loader>
    );
  if (error) return <Message negative>{error}</Message>;

  const renderTree = (parentNodeId: string | null): JSX.Element[] => {
    return nodes
      .filter((node) => node.parent_node_id === parentNodeId)
      .sort((a, b) => a.ordering - b.ordering)
      .map((node) => (
        <Container className="container-prop">
          <List.Item key={node.id}>
            <Icon name="folder" />
            <List.Content>
              <List.Header>{node.title}</List.Header>
              <List.List>{renderTree(node.id)}</List.List>
            </List.Content>
          </List.Item>
        </Container>
      ));
  };

  const handleNodeAdded = (newNode: Node) => {
    setNodes([...nodes, newNode]);
  };

  return (
    <div>
      <NodeInput
        parentNodeId={null}
        existingNodes={nodes}
        onNodeAdded={handleNodeAdded}
      />
      <List>{renderTree(null)}</List>
    </div>
  );
}
