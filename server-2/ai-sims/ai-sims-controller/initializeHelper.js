import llmController from "../../controllers/llmController.js";
import { DEFAULT_JSON_CHAT_MODEL, DEFAULT_WORLD_SIZE } from "../constants.js";

export function generateTown() {
  const size = DEFAULT_WORLD_SIZE;
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill({ type: "grass" }));

  addTreeClusters(grid, 90);
  // Create main roads
  createRoad(grid, { x: 25, y: 0 }, { x: 25, y: size - 1 }); // Vertical main street
  createRoad(grid, { x: 26, y: 0 }, { x: 26, y: size - 1 }); // Vertical main street
  createRoad(grid, { x: 0, y: 25 }, { x: size - 1, y: 25 }); // Horizontal main street
  createRoad(grid, { x: 0, y: 26 }, { x: size - 1, y: 26 }); // Horizontal main street

  // Add park area
  createPark(grid, { x: 28, y: 28 }, 11, 11);
  // Add random features
  addBenches(grid, 10);
  addStreetLamps(grid, 15);
// Commercial buildings  
addBuilding(grid, "market", { x: 30, y: 15 }, 8, 8, [  
  { type: "sign", x: 6, y: 1, text: "Willow Market", },  
  { type: "shelf", x: 2, y: 2, contents: "groceries", actions: ["viewItems", "buyGroceries"] },  
  { type: "counter", x: 4, y: 1, actions: ["checkout", "askForDiscount"] },  
  { type: "pharmacy", x: 6, y: 3, actions: ["buyMedicine", "getPrescription"] },  
]);  

addBuilding(grid, "flowerShop", { x: 14, y: 28 }, 6, 6, [  
  { type: "sign", x: 4, y: 1, text: "Mary's Flower Shop" },  
  { type: "flowerDisplay", x: 2, y: 2, actions: ["viewFlowers", "purchaseFlower"] },  
  { type: "gardeningTools", x: 4, y: 3, actions: ["trimFlowers", "checkStock"] },  
  { type: "orderForm", x: 3, y: 4, actions: ["createOrder", "submitOrder"] },  
]);  

addBuilding(grid, "cafe", { x: 3, y: 28 }, 6, 8, [  
  { type: "sign", x: 4, y: 1, text: "Local Café" },  
  { type: "coffeeMachine", x: 1, y: 2, actions: ["brewCoffee", "cleanMachine"] },  
  { type: "table", x: 3, y: 2, chairs: 4, actions: ["sitDown", "orderCoffee"] },  
  { type: "snackBar", x: 1, y: 3, actions: ["buySnack", "restockSnacks"] },  
]);  

// Residential neighborhood  
addBuilding(grid, "house", { x: 6, y: 5 }, 8, 8, [  
  { type: "sign", x: 1, y: 1, text: "Jason's Home" },  
  { type: "desk", x: 3, y: 3, hasComputer: true, actions: ["useComputer", "writeReport"] },  
  { type: "officeChair", x: 3, y: 4, actions: ["sit", "spinChair"] },  
  { type: "bookshelf", x: 4, y: 3, actions: ["readBook", "organizeBooks"] },  
], "south");  

addBuilding(grid, "house", { x: 16, y: 5 }, 8, 8, [  
  { type: "sign", x: 1, y: 1, text: "Willow's Home" },  
  { type: "oven", x: 4, y: 4, actions: ["bakeCake", "preheatOven"] },  
  { type: "counter", x: 3, y: 3, actions: ["prepareFood", "cleanCounter"] },  
  { type: "cateringSupplies", x: 5, y: 5, actions: ["checkInventory", "restockSupplies"] },  
], "south");  

createRoad(grid, { x: 6, y: 14 }, { x: 25, y: 14 });  

addBuilding(grid, "house", { x: 6, y: 16 }, 8, 8, [  
  { type: "sign", x: 1, y: 1, text: "Jessie's Home" },  
  { type: "desk", x: 3, y: 3, hasComputer: true, actions: ["useComputer", "designGraphic"] },  
  { type: "designTable", x: 4, y: 4, actions: ["sketchDesign", "organizeTools"] },  
  { type: "sketchpad", x: 3, y: 5, actions: ["draw", "erase"] },  
], "south");  

addBuilding(grid, "house", { x: 16, y: 16 }, 8, 8, [  
  { type: "sign", x: 1, y: 1, text: "Max's Home" },  
  { type: "desk", x: 3, y: 3, hasComputer: true, actions: ["useComputer", "browseInternet"] },  
  { type: "bookshelf", x: 4, y: 3, actions: ["readBook", "organizeBooks"] },  
], "south");

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
function addBuilding(
  grid,
  type,
  start,
  width,
  height,
  furniture,
  doorFacing = "north"
) {
  // Create external walls and floors
  for (let x = start.x; x < start.x + width; x++) {
    for (let y = start.y; y < start.y + height; y++) {
      if (
        x === start.x ||
        x === start.x + width - 1 ||
        y === start.y ||
        y === start.y + height - 1
      ) {
        grid[x][y] = { type: "wall", buildingType: type };
      } else {
        grid[x][y] = { type: "floor", buildingType: type };
      }
    }
  }

  switch (type) {
    case "house":
      const area = width * height;
      let numRooms = 1;
      if (area >= 50) numRooms = 2;
      if (area >= 75) numRooms = 3;
      if (area >= 100) numRooms = 4;

      let roomAreas = [];
      if (numRooms >= 2) {
        // Determine split direction based on aspect ratio
        if (width >= height) {
          // Vertical split
          let splitX = start.x + Math.floor(width * 0.4);
          splitX = Math.max(start.x + 1, Math.min(splitX, start.x + width - 2));
          const openingY = start.y + Math.floor(height / 2);
          for (let y = start.y + 1; y < start.y + height - 1; y++) {
            if (y !== openingY)
              grid[splitX][y] = { type: "wall", buildingType: type };
          }
          roomAreas.push(
            {
              type: "bedroom",
              x1: start.x + 1,
              x2: splitX - 1,
              y1: start.y + 1,
              y2: start.y + height - 2,
            },
            {
              type: "living room",
              x1: splitX + 1,
              x2: start.x + width - 2,
              y1: start.y + 1,
              y2: start.y + height - 2,
            }
          );
        } else {
          // Horizontal split
          let splitY = start.y + Math.floor(height * 0.4);
          splitY = Math.max(
            start.y + 1,
            Math.min(splitY, start.y + height - 2)
          );
          const openingX = start.x + Math.floor(width / 2);
          for (let x = start.x + 1; x < start.x + width - 1; x++) {
            if (x !== openingX)
              grid[x][splitY] = { type: "wall", buildingType: type };
          }
          roomAreas.push(
            {
              type: "bedroom",
              x1: start.x + 1,
              x2: start.x + width - 2,
              y1: start.y + 1,
              y2: splitY - 1,
            },
            {
              type: "living room",
              x1: start.x + 1,
              x2: start.x + width - 2,
              y1: splitY + 1,
              y2: start.y + height - 2,
            }
          );
        }
      }

      if (numRooms >= 3) {
        const livingRoom = roomAreas[1];
        const lrWidth = livingRoom.x2 - livingRoom.x1 + 1;
        const lrHeight = livingRoom.y2 - livingRoom.y1 + 1;

        if (lrWidth >= lrHeight) {
          // Vertical split
          let splitX = livingRoom.x1 + Math.floor(lrWidth * 0.4);
          splitX = Math.max(
            livingRoom.x1 + 1,
            Math.min(splitX, livingRoom.x2 - 1)
          );
          const openingY = livingRoom.y1 + Math.floor(lrHeight / 2);
          for (let y = livingRoom.y1; y <= livingRoom.y2; y++) {
            if (y !== openingY)
              grid[splitX][y] = { type: "wall", buildingType: type };
          }
          roomAreas[1] = { ...livingRoom, x2: splitX - 1 };
          roomAreas.push({
            type: "kitchen",
            x1: splitX + 1,
            x2: livingRoom.x2,
            y1: livingRoom.y1,
            y2: livingRoom.y2,
          });
        } else {
          // Horizontal split
          let splitY = livingRoom.y1 + Math.floor(lrHeight * 0.4);
          splitY = Math.max(
            livingRoom.y1 + 1,
            Math.min(splitY, livingRoom.y2 - 1)
          );
          const openingX = livingRoom.x1 + Math.floor(lrWidth / 2);
          for (let x = livingRoom.x1; x <= livingRoom.x2; x++) {
            if (x !== openingX)
              grid[x][splitY] = { type: "wall", buildingType: type };
          }
          roomAreas[1] = { ...livingRoom, y2: splitY - 1 };
          roomAreas.push({
            type: "kitchen",
            x1: livingRoom.x1,
            x2: livingRoom.x2,
            y1: splitY + 1,
            y2: livingRoom.y2,
          });
        }
      }

      if (numRooms >= 4) {
        const bedroom = roomAreas[0];
        const brWidth = bedroom.x2 - bedroom.x1 + 1;
        const brHeight = bedroom.y2 - bedroom.y1 + 1;

        if (brWidth >= brHeight) {
          // Vertical split
          let splitX = bedroom.x1 + Math.floor(brWidth * 0.4);
          splitX = Math.max(bedroom.x1 + 1, Math.min(splitX, bedroom.x2 - 1));
          const openingY = bedroom.y1 + Math.floor(brHeight / 2);
          for (let y = bedroom.y1; y <= bedroom.y2; y++) {
            if (y !== openingY)
              grid[splitX][y] = { type: "wall", buildingType: type };
          }
          roomAreas[0] = { ...bedroom, x2: splitX - 1 };
          roomAreas.push({
            type: "bathroom",
            x1: splitX + 1,
            x2: bedroom.x2,
            y1: bedroom.y1,
            y2: bedroom.y2,
          });
        } else {
          // Horizontal split
          let splitY = bedroom.y1 + Math.floor(brHeight * 0.4);
          splitY = Math.max(bedroom.y1 + 1, Math.min(splitY, bedroom.y2 - 1));
          const openingX = bedroom.x1 + Math.floor(brWidth / 2);
          for (let x = bedroom.x1; x <= bedroom.x2; x++) {
            if (x !== openingX)
              grid[x][splitY] = { type: "wall", buildingType: type };
          }
          roomAreas[0] = { ...bedroom, y2: splitY - 1 };
          roomAreas.push({
            type: "bathroom",
            x1: bedroom.x1,
            x2: bedroom.x2,
            y1: splitY + 1,
            y2: bedroom.y2,
          });
        }
      }

      // Add default furniture if none provided
      if (furniture.length === 0) {
        roomAreas.forEach((room) => {
          const centerX = room.x1 + Math.floor((room.x2 - room.x1) / 2);
          const centerY = room.y1 + Math.floor((room.y2 - room.y1) / 2);
          const localX = centerX - start.x;
          const localY = centerY - start.y;

          switch (room.type) {
            case "bedroom":
              furniture.push(
                { type: "bed", x: localX, y: localY },
                { type: "wardrobe", x: localX + 1, y: localY }
              );
              break;
            case "living room":
              furniture.push(
                { type: "sofa", x: localX, y: localY },
                { type: "table", x: localX + 1, y: localY }
              );
              break;
            case "kitchen":
              furniture.push(
                { type: "counter", x: localX, y: localY },
                { type: "oven", x: localX + 1, y: localY }
              );
              break;
            case "bathroom":
              furniture.push(
                { type: "toilet", x: localX, y: localY },
                { type: "shower", x: localX + 1, y: localY }
              );
              break;
          }
        });
      }

      break;
    case "market":
      break;
    default:
      break;
  }

  switch (doorFacing) {
    case "north":
      grid[start.x + width - 2][start.y] = {
        type: "door",
        buildingType: type,
      };
      break;
    case "south":
      grid[start.x + 1][start.y + height - 1] = {
        type: "door",
        buildingType: type,
      };
      break;
    case "east":
      grid[start.x + width - 1][start.y + height - 1] = {
        type: "door",
        buildingType: type,
      };
      break;
    case "west":
      grid[start.x][start.y + height - 1] = {
        type: "door",
        buildingType: type,
      };
      break;
    default:
      grid[start.x + Math.floor(width / 2)][start.y + height - 1] = {
        type: "door",
        buildingType: type,
      };
  }

  // Add furniture
  furniture.forEach((item) => {
    console.log("Furnature Item", item);

    const posX = start.x + item.x;
    const posY = start.y + item.y;
    if (grid[posX][posY].type === "floor") {
      grid[posX][posY] = {
        ...grid[posX][posY],
        object: Object.keys(item).reduce((obj, key) => {
          if (key !== "x" && key !== "y") {
            obj[key] = item[key];
          }
          return obj;
        }, {}),
      };
    }
  });
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
    const parsedInitialMemoryObjects = JSON.parse(initialMemoryObjects);
    return parsedInitialMemoryObjects.memories;
  } catch (error) {
    console.error("Error getting initial memories:", error);
    return [];
  }
};
