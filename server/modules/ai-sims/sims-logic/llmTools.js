const moveToCoordinates = {
  type: "function",
  function: {
    name: "move_to_coordinate",
    description: "Move to a specific location with x and y coordinates",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        x: { type: "number", description: "The x coordinate" },
        y: { type: "number", description: "The y coordinate" },
      },
      required: ["agentName", "x", "y"],
      additionalProperties: false,
    },
  },
  strict: true,
};

const moveToPlace = {
  type: "function",
  function: {
    name: "move_to_place",
    description: "Move to a specific location with a building name",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        buildingName: { type: "string", description: "The building name" },
        roomName: {
          type: "string",
          description: "Optional room name if the building has rooms",
        },
      },
      required: ["agentName", "buildingName"],
      additionalProperties: false,
    },
  },
  strict: true,
};

const talkTo = {
  type: "function",
  function: {
    name: "talk_to",
    description:
      "Talk to another agent. The content should be constructive, not just small talk.",
    parameters: {
      type: "object",
      properties: {
        agentName: {
          type: "string",
          description: "The agent name, must be full name",
        },
        targetAgentName: {
          type: "string",
          description: "The target agent name, must be full name",
        },
        text: { type: "string", description: "The text to say" },
        tone: {
          type: "string",
          description:
            "The conversation tone (e.g., 'neutral', 'friendly', 'angry')",
        },
        status: {
          type: "string",
          description: "The status to set",
        },
      },
      required: ["agentName", "targetAgentName", "text", "tone", "status"],
      additionalProperties: false,
    },
  },
  strict: true,
};

const changeStatus = {
  type: "function",
  function: {
    name: "change_agent_current_status",
    description:
      "Update what the agent is currently doing (e.g., running, eating, etc.). If movement is required, use with move_to.",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        status: { type: "string", description: "The new status" },
      },
      required: ["agentName", "status"],
      additionalProperties: false,
    },
  },
};

const updateObject = {
  type: "function",
  function: {
    name: "update_object",
    description:
      "Modify or add an object at a specific location (e.g., updating a computer to be 'occupied').",
    parameters: {
      type: "object",
      properties: {
        objectX: {
          type: "number",
          description: "The x coordinate of the object",
        },
        objectY: {
          type: "number",
          description: "The y coordinate of the object",
        },
        objectName: { type: "string", description: "The object's name" },
        objectStatus: {
          type: "string",
          description: "The object's new status",
        },
      },
      required: ["objectX", "objectY", "objectName", "objectStatus"],
    },
  },
};

const notReactToObservation = {
  type: "function",
  function: {
    name: "not_react_to_observation",
    description: "The agent does not react to an observation.",
  },
};

const reply = {
  type: "function",
  function: {
    name: "reply",
    description:
      "Reply with either: 1) Specific memory detail, 2) Provocative question, or 3) Actionable suggestion.",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        targetAgentName: {
          type: "string",
          description: "The target agent name",
        },
        text: { type: "string", description: "The reply text" },
        tone: {
          type: "string",
          description:
            "The conversation tone (e.g., 'neutral', 'friendly', 'angry')",
        },
      },
      required: ["agentName", "targetAgentName", "text", "tone"],
      additionalProperties: false,
    },
  },
};

const endConversation = {
  type: "function",
  function: {
    name: "end_conversation",
    description: "End the conversation.",
  },
};

const dontReply = {
  type: "function",
  function: {
    name: "dont_reply",
    description: "Do not reply to another agent's message.",
  },
};

const replyAndEndConversation = {
  type: "function",
  function: {
    name: "reply_and_end_conversation",
    description: "Reply and then end the conversation.",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        targetAgentName: {
          type: "string",
          description: "The target agent name",
        },
        text: { type: "string", description: "The reply text" },
        tone: {
          type: "string",
          description:
            "The conversation tone (e.g., 'neutral', 'friendly', 'angry')",
        },
      },
      required: ["agentName", "targetAgentName", "text", "tone"],
      additionalProperties: false,
    },
  },
};

const moveToAnotherLocationTogether = {
  type: "function",
  function: {
    name: "move_to_another_location_together",
    description:
      "Move with another agent to a location, crucial for discovering new evidence.",
    parameters: {
      type: "object",
      properties: {
        agentName: { type: "string", description: "The agent name" },
        targetAgentName: {
          type: "string",
          description: "The target agent name",
        },
        location: { type: "string", description: "The location to move to" },
      },
      required: ["agentName", "targetAgentName", "location"],
      additionalProperties: false,
    },
  },
  strict: true,
};


export const agentActions = [
  moveToCoordinates,
  changeStatus,
  updateObject,
  notReactToObservation,
];

export const conversationalActions = [
  talkTo,
  reply,
  endConversation,
  dontReply,
  replyAndEndConversation,
  moveToAnotherLocationTogether,
];

export const movingActions = [
  moveToPlace
]

export const updateScheduleActions = [
  changeStatus
]