import React, { useEffect, useState } from "react";
import { getNodes, moveNode, changeNodeOrder } from "../utils/api";
import { List, Loader, Message, Container, Icon } from "semantic-ui-react";
import NodeInput from "./NodeAdd";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./style.css";

interface Node {
  id: string;
  title: string;
  parent_node_id: string | null;
  ordering: number;
}

interface SortableNodeProps {
  node: Node;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SortableNode: React.FC<SortableNodeProps> = ({
  node,
  isExpanded,
  onToggle,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <List.Item>
        <Container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div {...attributes} {...listeners} style={{ cursor: "move" }}>
            <Icon name="bars" />
          </div>
          <span style={{ marginLeft: "5px" }}>{node.title}</span>
          <Icon
            name={isExpanded ? "caret down" : "caret right"}
            onClick={onToggle}
            style={{ cursor: "pointer", marginBottom: "4px" }}
          />
        </Container>
        {isExpanded && <List style={{ marginLeft: "20px" }}>{children}</List>}
      </List.Item>
    </div>
  );
};

export default function TreeView() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleToggle = (nodeId: string) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setNodes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      try {
        const draggedNode = nodes.find((node) => node.id === active.id);
        const targetNode = nodes.find((node) => node.id === over?.id);

        if (draggedNode && targetNode) {
          await moveNode({ parentNodeId: targetNode.parent_node_id || "" });
          await changeNodeOrder({ ordering: newIndex });
        }

        const updatedNodes = await getNodes();
        setNodes(updatedNodes);
      } catch (error) {
        console.error("Error updating node position:", error);
        setError("Failed to update node position");
      }
    }
  };

  const renderTree = (parentNodeId: string | null): JSX.Element => {
    const childNodes = nodes
      .filter((node) => node.parent_node_id === parentNodeId)
      .sort((a, b) => a.ordering - b.ordering);

    return (
      <SortableContext
        items={childNodes.map((node) => node.id)}
        strategy={verticalListSortingStrategy}
      >
        <List>
          {childNodes.map((node) => {
            const isExpanded = expandedNodes.includes(node.id);
            return (
              <SortableNode
                key={node.id}
                node={node}
                isExpanded={isExpanded}
                onToggle={() => handleToggle(node.id)}
              >
                {renderTree(node.id)}
              </SortableNode>
            );
          })}
        </List>
      </SortableContext>
    );
  };

  const handleNodeAdded = (newNode: Node) => {
    setNodes([...nodes, newNode]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        <NodeInput
          parentNodeId={null}
          existingNodes={nodes}
          onNodeAdded={handleNodeAdded}
        />
        {error && (
          <Container textAlign="center" style={{ paddingTop: "10px" }}>
            <Message negative>{error}</Message>
          </Container>
        )}
        {renderTree(null)}
      </div>
    </DndContext>
  );
}
