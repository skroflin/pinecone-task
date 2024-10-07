import { useEffect, useState } from "react";
import { getNodes } from "../utils/api";
import { List, Loader, Message, Container, Dropdown } from "semantic-ui-react";
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
  const [expandedNodes, setExpanedNodes] = useState<string[]>([]);

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
        <Loader />
      </Loader>
    );
  if (error) return <Message negative>{error}</Message>;

  const handleToggle = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      setExpanedNodes(expandedNodes.filter((id) => id !== nodeId));
    } else {
      setExpanedNodes([...expandedNodes, nodeId]);
    }
  };

  const renderTree = (parentNodeId: string | null): JSX.Element[] => {
    return nodes
      .filter((node) => node.parent_node_id === parentNodeId)
      .sort((a, b) => a.ordering - b.ordering)
      .map((node) => {
        const isExpanded = expandedNodes.includes(node.id);
        return (
          <List.Item key={node.id}>
            <Container style={{ display: "flex", alignItems: "center" }}>
              <i className="folder icon" />
              <Dropdown
                text={node.title}
                icon={isExpanded ? "angle down" : "angle right"}
                onClick={() => handleToggle(node.id)}
                style={{ marginLeft: "5px" }}
              >
                <Dropdown.Menu>
                  {isExpanded && (
                    <>
                      {renderTree(node.id).map((child) => (
                        <Dropdown.Item key={child.key}>{child}</Dropdown.Item>
                      ))}
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Container>
          </List.Item>
        );
      });
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
