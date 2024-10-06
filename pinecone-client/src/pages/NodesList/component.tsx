import React from "react";
import { ListItem, List, Loader } from "semantic-ui-react";
import { Nodes } from "../../UI/Nodes";
import { useQuery } from "@tanstack/react-query";
import { getNodes } from "../../utils/api";

const NodeList: React.FC = () => {
  const {
    isLoading,
    error,
    data: nodes,
  } = useQuery({
    queryKey: ["nodes"],
    queryFn: getNodes,
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching nodes: {error.message}</p>;

  if (!Array.isArray(nodes)) {
    return <p>No nodes available</p>;
  }

  return (
    <List>
      {nodes.map((node: Nodes, index: number) => (
        <ListItem key={index}>{node.title}</ListItem>
      ))}
    </List>
  );
};

export default NodeList;
