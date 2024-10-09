CREATE TABLE nodes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    parent_node_id INT,
    ordering INT,
    FOREIGN KEY (parent_node_id) REFERENCES nodes(id)
);