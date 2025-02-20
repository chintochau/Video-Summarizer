import llmController from "../../controllers/llmController.js";
import { DEFAULT_JSON_CHAT_MODEL, DEFAULT_WORLD_SIZE, TOWN_LAYOUT } from "../constants.js";

// Town Configuration Structure

// New generateTown function
export function generateTown(layout = TOWN_LAYOUT) {
  const grid = initializeGrid(layout.size);

  layout.features.forEach((feature) => {
    switch (feature.type) {
      case "roads":
        feature.items.forEach((road) => {
          if (road.direction) {
            createAxisRoad(grid, road.direction, road.position, road.length);
          } else {
            createRoad(grid, road.start, road.end);
          }
        });
        break;
      case "park":
        createPark(grid, feature.position, feature.width, feature.height);
        break;
      case "trees":
        addTreeClusters(grid, feature.count);
        break;
      case "benches":
        addBenches(grid, feature.count);
        break;
      case "lamps":
        addStreetLamps(grid, feature.count);
        break;
    }
  });

  layout.buildings.forEach((building) => {
    addBuilding(grid, building);
  });

  return grid;
}

function createRoad(grid, start, end) {
  // Vertical road
  if (start.x === end.x) {
    for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
      grid[start.x][y] = { type: "road" };
      // Add sidewalks
      if (start.x > 0) {
        if (grid[start.x - 1][y].type !== "road") {
          grid[start.x - 1][y] = { type: "sidewalk" };
        }
      }
      if (start.x < grid.length - 1) {
        if (grid[start.x + 1][y].type !== "road") {
          grid[start.x + 1][y] = { type: "sidewalk" };
        }
      }
    }
  }
  // Horizontal road
  else if (start.y === end.y) {
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
      grid[x][start.y] = { type: "road" };
      // Add sidewalks
      if (start.y > 0) {
        if (grid[x][start.y - 1].type !== "road") {
          grid[x][start.y - 1] = { type: "sidewalk" };
        }
      }
      if (start.y < grid[0].length - 1) {
        if (grid[x][start.y + 1].type !== "road") {
          grid[x][start.y + 1] = { type: "sidewalk" };
        }
      }
    }
  }
}

function createPark(grid, start, width, height) {
  for (let x = start.x; x < start.x + width; x++) {
    for (let y = start.y; y < start.y + height; y++) {
      grid[x][y] = { type: "grass" };

      // Add walking paths
      if (
        x === start.x + Math.floor(width / 2) ||
        y === start.y + Math.floor(height / 2)
      ) {
        grid[x][y] = { type: "road" };
      }
    }
  }

  // Add park features
  addParkFeatures(grid, start, width, height);
}

function addParkFeatures(grid, start, width, height) {
  // Add benches
  grid[start.x + 2][start.y + 2] = {
    type: "grass",
    object: { type: "bench", facing: "north" },
  };
  grid[start.x + width - 3][start.y + height - 3] = {
    type: "grass",
    object: { type: "bench", facing: "south" },
  };

  // Add fountain
  const centerX = start.x + Math.floor(width / 2);
  const centerY = start.y + Math.floor(height / 2);
  grid[centerX][centerY] = { type: "path", object: { type: "fountain" } };

  // Add trees
  for (let i = 0; i < 5; i++) {
    const x = start.x + Math.floor(Math.random() * width);
    const y = start.y + Math.floor(Math.random() * height);
    if (grid[x][y].type === "grass") {
      grid[x][y] = { type: "tree" };
    }
  }
}

function addTreeClusters(grid, count) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * grid.length);
    const y = Math.floor(Math.random() * grid[0].length);
    if (grid[x][y].type === "grass") {
      grid[x][y] = { type: "tree" };
      // Add surrounding trees
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (
            x + dx >= 0 &&
            x + dx < grid.length &&
            y + dy >= 0 &&
            y + dy < grid[0].length &&
            Math.random() < 0.5
          ) {
            grid[x + dx][y + dy] = { type: "tree" };
          }
        }
      }
    }
  }
}

function addBenches(grid, count) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * grid.length);
    const y = Math.floor(Math.random() * grid[0].length);
    if (grid[x][y].type === "path" || grid[x][y].type === "sidewalk") {
      grid[x][y] = {
        type: grid[x][y].type,
        object: {
          type: "bench",
          facing: ["north", "south", "east", "west"][
            Math.floor(Math.random() * 4)
          ],
        },
      };
    }
  }
}

function addStreetLamps(grid, count) {
  for (let i = 0; i < grid.length; i = i + 6) {
    for (let j = 0; j < grid[0].length; j = j + 6) {
      if (grid[i][j].type === "sidewalk") {
        grid[i][j] = { type: "sidewalk", object: { type: "street_lamp" } };
      }
    }
  }
}

function addBuilding(grid, config) {
  const {
    name,
    position,
    width,
    height,
    rooms = ["main"],
    furniture = [],
    doorFacing = "south",
    exteriorType = "wall",
  } = config;

  // Create exterior structure
  createExteriorWalls(grid, name, position, width, height, exteriorType);
  addDoor(grid, name, position, width, height, doorFacing);

  // Handle room creation (empty array = open layout)
  const createdRooms =
    rooms.length > 0
      ? createRooms(grid, name, position, width, height, rooms)
      : [createOpenSpace(grid, name, position, width, height)];

  // Add furniture
  addFurnitureToGrid(grid, position, createdRooms, furniture);
}

// Helper functions
function createExteriorWalls(grid, type, start, width, height,exteriorType) {
  for (let x = start.x; x < start.x + width; x++) {
    for (let y = start.y; y < start.y + height; y++) {
      const isWall =
        x === start.x ||
        x === start.x + width - 1 ||
        y === start.y ||
        y === start.y + height - 1;
      grid[x][y] = {
        type: isWall ? exteriorType : "floor",
        building: type,
        room: "exterior",
      };
    }
  }
}

function addDoor(grid, type, start, width, height, doorFacing) {
  const doorPositions = {
    north: { x: start.x + width - 2, y: start.y },
    south: { x: start.x + 1, y: start.y + height - 1 },
    east: { x: start.x + width - 1, y: start.y + height - 2 },
    west: { x: start.x, y: start.y + 1 },
  };

  const pos = doorPositions[doorFacing] || doorPositions.south;
  grid[pos.x][pos.y] = { type: "door", building: type, room: "entrance" };
}

function createRooms(grid, type, start, width, height, roomTypes) {
  let rooms = [
    {
      x1: start.x + 1,
      x2: start.x + width - 2,
      y1: start.y + 1,
      y2: start.y + height - 2,
      type: "main",
    },
  ];

  while (rooms.length < roomTypes.length) {
    const roomIndex = findLargestRoom(rooms);
    if (roomIndex === -1) break; // Prevent errors if no valid room found

    const [room1, room2] = splitRoom(grid, type, rooms[roomIndex]);

    if (!room1 || !room2) break; // Ensure valid rooms

    rooms.splice(roomIndex, 1, room1, room2);
  }

  // Assign room types from the provided list
  rooms.forEach((room, i) => {
    room.type = roomTypes[i % roomTypes.length]; // Cycle if fewer types than rooms
    updateRoomTiles(grid, room);
  });

  return rooms;
}

function findLargestRoom(rooms) {
  let maxIndex = 0;
  let maxArea = 0;
  rooms.forEach((room, i) => {
    const area = (room.x2 - room.x1) * (room.y2 - room.y1);
    if (area > maxArea) {
      maxArea = area;
      maxIndex = i;
    }
  });
  return maxIndex;
}

function splitRoom(grid, buildingType, room) {
  const width = room.x2 - room.x1;
  const height = room.y2 - room.y1;
  const splitVertically = width > height;

  let splitCoord, opening;
  if (splitVertically) {
    splitCoord = room.x1 + Math.floor(width * 0.4);
    opening = room.y1 + Math.floor(height / 2);
    for (let y = room.y1; y <= room.y2; y++) {
      if (y !== opening) {
        grid[splitCoord][y] = { type: "wall", building: buildingType };
      }
    }
    return [
      { ...room, x2: splitCoord - 1 },
      { ...room, x1: splitCoord + 1 },
    ];
  } else {
    splitCoord = room.y1 + Math.floor(height * 0.4);
    opening = room.x1 + Math.floor(width / 2);
    for (let x = room.x1; x <= room.x2; x++) {
      if (x !== opening) {
        grid[x][splitCoord] = { type: "wall", building: buildingType };
      }
    }
    return [
      { ...room, y2: splitCoord - 1 },
      { ...room, y1: splitCoord + 1 },
    ];
  }
}

function updateRoomTiles(grid, room) {
  for (let x = room.x1; x <= room.x2; x++) {
    for (let y = room.y1; y <= room.y2; y++) {
      if (grid[x][y].type === "floor") {
        grid[x][y].room = room.type;
      }
    }
  }
}

function addFurnitureToGrid(grid, start, rooms, furniture) {
  if (furniture.length === 0) {
    furniture = generateDefaultFurniture(start, rooms);
  }

  console.log(rooms, furniture);

  furniture.forEach((item) => {
    const x = start.x + item.x;
    const y = start.y + item.y;
    console.log(x, y, item);

    grid[x][y].object = item;
  });
}

// Helper functions
function createOpenSpace(grid, buildingName, position, width, height) {
  const openSpace = {
    x1: position.x + 1,
    x2: position.x + width - 2,
    y1: position.y + 1,
    y2: position.y + height - 2,
    type: "open",
  };

  updateRoomTiles(grid, openSpace);
  return openSpace;
}

function initializeGrid(size) {
  return Array(size)
    .fill()
    .map(() => Array(size).fill({ type: "grass" }));
}

function createAxisRoad(grid, direction, position, length) {
  const start = length === "full" ? 0 : position;
  const end = length === "full" ? DEFAULT_WORLD_SIZE - 1 : position + length;

  if (direction === "vertical") {
    createRoad(grid, { x: position, y: start }, { x: position, y: end });
  } else {
    createRoad(grid, { x: start, y: position }, { x: end, y: position });
  }
}

function generateDefaultFurniture(start, rooms) {
  const furniture = [];
  const types = {
    bedroom: ["bed", "wardrobe"],
    "living room": ["sofa", "table"],
    kitchen: ["counter", "oven"],
    bathroom: ["toilet", "shower"],
  };

  rooms.forEach((room) => {
    const centerX = Math.floor((room.x1 + room.x2) / 2) - start.x;
    const centerY = Math.floor((room.y1 + room.y2) / 2) - start.y;
    (types[room.type] || []).forEach((type, i) => {
      furniture.push({ type, x: centerX + i, y: centerY });
    });
  });

  return furniture;
}

export const initializeAgentMomories = async (agent, initialMemory) => {
  const body = {
    messages: [
      {
        role: "user",
        content: `You will be given a script describing an agent, or environmental observations. you task is to provide an array of memorie objects. for each of the memory, it should be written in 3rd person format. And you will access the importance on the scale of 1 to 10, where 1 is purely mundane
  (e.g., brushing teeth, making bed) and 10 is
  extremely poignant (e.g., a break up, college
  acceptance), rate the likely poignancy of that memory.`,
      },
      {
        role: "user",
        content: `the JSON format of a Single Memory is as follow 
  { 
  "content":String,
  "importance:Number,
  }
          , your response should be an array of memories in JSON format. `,
      },
      {
        role: "user",
        content: "this is the initial memory of the agent: " + initialMemory,
      },
    ],
    selectedModel: DEFAULT_JSON_CHAT_MODEL,
    response_format: {
      type: "json_object",
    },
  };
  try {
    const initialMemoryObjects = await llmController.getChatCompletion({
      body: body,
    });
    const parsedInitialMemoryObjects = JSON.parse(initialMemoryObjects.content);
    return parsedInitialMemoryObjects.memories;
  } catch (error) {
    console.error("Error getting initial memories:", error);
    return [];
  }
};
