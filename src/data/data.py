import json
import math

# Define layout parameters
NODE_WIDTH = 350  # Increased node width
NODE_HEIGHT = 200  # Increased node height
SPACING = 150  # Increased spacing
LAYOUT_WIDTH = 3000  # Larger layout width to ensure proper spacing

# Load the JSON data
with open('duplicate.json', 'r') as f:
    data = json.load(f)

# Calculate the number of columns based on layout width
space_per_node = NODE_WIDTH + SPACING
GRID_COLS = math.floor(LAYOUT_WIDTH / space_per_node)

# Calculate new positions for each node
nodes = data['initialNodes']
for i, node in enumerate(nodes):
    # Determine the grid position (row, col)
    row = i // GRID_COLS
    col = i % GRID_COLS
    
    # Calculate x and y coordinates
    x = col * (NODE_WIDTH + SPACING)
    y = row * (NODE_HEIGHT + SPACING)
    
    # Update the node's position
    node['position']['x'] = x
    node['position']['y'] = y

# Save the modified JSON
with open('updated_data_1.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Nodes have been repositioned and saved to 'updated_data_1.json'")