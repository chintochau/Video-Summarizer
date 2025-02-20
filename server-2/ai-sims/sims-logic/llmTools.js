
export const agentActions = [
    {
      type: "function",
      function: {
        name: "move_to",
        description: "Move to a specific location",
        parameters: {
          type: "object",
          properties: {
            agentName: { type: "string", description: "The agent name" },
            x: { type: "number", description: "The x coordinate" },
            y: { type: "number", description: "The y coordinate" },
          },
        },
        required: ["agentName", "x", "y"],
        additionalProperties: false,
      },
      strict: true,
    },
    // {
    //   type: "function",
    //   function: {
    //     name: "initiate_physical_contact",
    //     description:
    //       "Attempt physical interaction with anotherone, if it is conversation only, use talk_to function instead. you can combine both when needed",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         agentName: { type: "string", description: "The agent name" },
    //         targetAgentName: {
    //           type: "string",
    //           description: "The target agent name",
    //         },
    //         contactType: {
    //           type: "string",
    //           description:
    //             "The contact type, that can be anything, for example, 'hug', 'handshake', 'shove', 'pat', etc",
    //         },
    //       },
    //       required: ["agentName", "targetAgentName", "contactType"],
    //       additionalProperties: false,
    //     },
    //   },
    // },
    {
      type: "function",
      function: {
        name: "talk_to",
        description: "Talk to another agent",
        parameters: {
          type: "object",
          properties: {
            agentName: { type: "string", description: "The agent name, must be in full name" },
            targetAgentName: {
              type: "string",
              description: "The target agent name, must be in full name ",
            },
            text: { type: "string", description: "The text to say" },
            tone: {
              type: "string",
              description:
                "The conversation tone, that can be anything, for example, 'neutral', 'friendly, 'angry', etc",
            },
            status: {
              type: "string",
              description: "The status to set",
            },
          },
        },
        required: ["agentName", "targetAgentName", "text", "tone", "status"],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: "function",
      function: {
        name: "change_agent_current_status",
        description:
          "current status shows what the agent is doing (e.g. running, preparing meal, kissing someone, etc). If the agent should change their current status, for example stop doing what they are doing and start doing something else. This function should be used to change the current status of an agent. if the status reuqired change of location, combine with move_to function",
        parameters: {
          type: "object",
          properties: {
            agentName: { type: "string", description: "The agent name" },
            status: { type: "string", description: "The status to set" },
          },
          required: ["agentName", "status"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_object",
        description:
          "Add an Object or Modify properties of an object in a location, for example update the computer status to be occupied",
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
            objectName: { type: "string", description: "The name of the object" },
            ObjectStatus: {
              type: "string",
              description: "The status of the object",
            },
          },
          required: ["objectX", "objectY", "objectName", "ObjectStatus"],
        },
      },
    },
  
    {
      // not react to observation
      type: "function",
      function: {
        name: "not_react_to_observation",
        description:
          "The agent does not react to the observation, for example the agent is in a room, and the observation is the room, which has nothing happend. Agent will continue doing the same action",
      },
    },
    // {
    //   // self reflect
    //   type: "function",
    //   function: {
    //     name: "self_reflect",
    //     description:
    //       "The agent reflects on their own thoughts, for example the agent may reflect on the thoughts they have had in the past, or the thoughts they are about to have, or to clear up any confusion",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         agentName: { type: "string", description: "The agent name" },
    //         text: { type: "string", description: "The text to reflect on" },
    //         status: {
    //           type: "string",
    //           description: "After reflecting, the agent will have a new status",
    //         },
    //       },
    //       required: ["agentName", "text"],
    //       additionalProperties: false,
    //     },
    //   },
    // },
  ];
  


export const conversationalActions = [
    {
      type: "function",
      function: {
        name: "end_conversation",
        description: "End the conversation",
      },
    },
    {
      type: "function",
      function: {
        name: "dont_reply",
        description: "Don't reply to another agent's message",
      },
    },
    {
      type: "function",
      function: {
        name: "reply",
        description: "Reply to another agent's message",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            agentName: { type: "string", description: "The agent name" },
            targetAgentName: {
              type: "string",
              description: "The target agent name",
            },
            text: { type: "string", description: "The text to say" },
            tone: {
              type: "string",
              description:
                "The conversation tone, that can be anything, for example, 'neutral', 'friendly, 'angry', etc",
            },
          },
          required: ["agentName", "targetAgentName", "text", "tone"],
          additionalProperties: false,
        },
      },
    },
  ];
  