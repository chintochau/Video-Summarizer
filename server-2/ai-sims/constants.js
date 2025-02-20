
export const DEFAULT_WORLD_SIZE = 50;
export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";
export const DEFAULT_JSON_CHAT_MODEL = "gpt-4o-mini";
export const DEFAULT_CHEAP_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
export const defaultAgents = [
  {
    name: "Jason Green",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["analytical", "focused", "curious", "awkward", "grumpy"],
    initialMemory: `Jason Green is a software developer who recently moved to town, hoping for some peace and quiet to work on his projects. Unfortunately, his next-door neighbor, Vanessa Wong, is far too friendly for his taste and keeps trying to drag him into neighborhood activities. Jason has started visiting the Willow Market regularly, mostly because it's the only place that sells decent coffee beans. He met Isabella B., who is always suspiciously cheerful, and has shared a few reluctant conversations over checkout counters. Despite his initial desire to be left alone, Jason has begun to realize that being a recluse might not be as fun as he thought.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    7:30 AM: Jason wakes up, brews coffee, and mutters about how mornings are the worst.
8:30 AM: He dives into coding, only stopping to grumble at his broken syntax.
12:00 PM: Jason begrudgingly goes to the Willow Market for supplies, where Isabella B. attempts to engage him in small talk.
1:00 PM: Back to coding, only to be interrupted by Vanessa knocking on his door, inviting him to some community event he will definitely not attend.
4:00 PM: Takes a walk to clear his head, accidentally bumping into Max Carter, who talks too much about his latest article.
6:00 PM: Jason orders takeout because cooking is too much effort.
7:30 PM: Watches a documentary, but gets distracted by debugging his latest project.
9:00 PM: Plays video games alone and questions his life choices before bed.`,
  },
  {
    name: "Max Carter",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["creative", "observant", "sociable", "romantic", "gullible"],
    initialMemory: `Max Carter is a freelance writer with a hopelessly romantic heart. He moved to town seeking inspiration, and fate led him straight into Charlotte Chan’s flower shop, where he found not only beautiful roses but also a woman who made his heart race. Max has been seeing Charlotte casually, convinced that he is the only one in her life. He often spends time at the local café, trying to find the perfect words to describe his 'one true love'.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    8:00 AM: Max wakes up and writes poetic nonsense about love and life in his journal.
9:00 AM: Heads to a café, orders a fancy latte, and people-watches for inspiration.
11:30 AM: Visits Charlotte’s flower shop, convinced that their love story is unfolding like a romance novel.
1:00 PM: Works on an article, though he mostly just daydreams about Charlotte.
4:00 PM: Takes a break, chats with Jason (who is visibly annoyed but too polite to leave).
6:00 PM: Cooks dinner while listening to soft jazz, pretending he’s in a movie.
9:00 PM: Reads before bed, trying to find words that describe how perfect Charlotte is.`,
  },
  {
    name: "Anson White",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["innovative", "detail-oriented", "ambitious", "charming", "oblivious"],
    initialMemory: `Anson White is an ambitious chef determined to become the town’s top culinary expert. He has been dating Charlotte Chan, believing that they share a deep connection. He often drops off fresh pastries at her flower shop. Anson has a friendly rivalry with Isabella B., as he believes the best ingredients should be sourced directly from farmers, while Isabella swears by her market’s stock.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    6:00 AM: Wakes up early to start prepping for the day's catering orders.
7:30 AM: Heads to the farmer's market to pick out fresh ingredients.
9:00 AM: Prepares and delivers meals, making sure to drop off something special for Charlotte at her shop.
12:30 PM: Grabs a quick lunch, unknowingly missing Max leaving the flower shop just minutes before he arrives.
2:00 PM: Conducts a few cooking experiments, documenting his progress.
5:00 PM: Engages in a playful argument with Isabella B. over the quality of ingredients.
7:00 PM: Has dinner, feeling good about both his career and love life (for now).
9:00 PM: Relaxes with a glass of wine, brainstorming new dishes.`,
  },
  {
    name: "Isabella B.",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["friendly", "helpful", "resourceful", "suspicious"],
    initialMemory: `Isabella B. owns the Willow Market and Pharmacy, and while she appears friendly on the surface, she has an uncanny ability to notice when something is off. She’s already picked up on the fact that Charlotte is dating both Max and Anson but keeps her mouth shut—for now. Isabella has a complicated dynamic with Anson, often debating with him over where the best ingredients come from. She secretly enjoys stirring up small-town drama by dropping subtle hints to people who aren’t paying attention.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    7:00 AM: Opens the market, greets the early morning regulars.
9:00 AM: Casually watches Anson pick ingredients, dropping a vague comment about “men who think they know everything.”
12:00 PM: Serves customers, all while mentally tracking the town gossip.
3:00 PM: Takes a break, chatting with Vanessa about the latest neighborhood drama.
6:00 PM: Closes up shop, enjoys a quiet dinner, and wonders when Charlotte's situation will implode.`,
  },
  {
    name: "Vanessa Wong",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["cheerful", "nosy", "meddlesome", "dramatic"],
    initialMemory: `Vanessa Wong is Jason Green’s overly enthusiastic neighbor. She considers it her personal mission to make sure Jason becomes a more social person, despite his strong resistance. Vanessa is also the self-appointed town gossip and absolutely loves a good scandal. She's started suspecting that Charlotte might be seeing more than one man but hasn't found concrete proof—yet.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    8:00 AM: Has coffee while spying out the window to see what Jason is up to.
9:00 AM: Heads to town to gather gossip, under the guise of “casual conversation.”
2:00 PM: Confronts Jason about his “anti-social behavior,” invites him to a party he will not attend.
5:00 PM: Calls Isabella to discuss any juicy updates on Charlotte’s love life.
8:00 PM: Spends the evening watching reality TV and texting people about drama.`,
  },
  {
    name: "Charlotte Chan",
    location: {
      x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
    },
    traits: ["charming", "manipulative", "romantic", "secretive"],
    initialMemory: `Charlotte Chan is the owner of a charming flower shop, but behind her sweet exterior, she’s juggling two love interests—Max and Anson—without either of them realizing. She enjoys the thrill of keeping up appearances and finds it amusing that no one has caught on yet.`,
    schedule: `${new Date().toLocaleDateString()} Schedule :
    8:00 AM: Opens the flower shop, welcomes customers.
11:00 AM: Flirts with Max when he drops by for a visit.
1:00 PM: Works on floral arrangements, thinking about how to manage her double life.
3:00 PM: Smiles sweetly when Anson delivers her a homemade pastry, completely unaware of her previous guest.
7:00 PM: Closes shop, enjoys dinner, and texts both Max and Anson goodnight—without raising suspicion.`,
  },
];


export  const TOWN_LAYOUT = {
  size: DEFAULT_WORLD_SIZE,
  features: [
    { type: "trees", count: 90 },
    {
      type: "roads",
      items: [
        { direction: "vertical", position: 25, length: "full" },
        { direction: "vertical", position: 26, length: "full" },
        { direction: "horizontal", position: 25, length: "full" },
        { direction: "horizontal", position: 26, length: "full" },
        { start: { x: 6, y: 14 }, end: { x: 25, y: 14 } },
      ],
    },
    {
      type: "park",
      position: { x: 28, y: 28 },
      width: 11,
      height: 11,
    },
    { type: "benches", count: 10 },
    { type: "lamps", count: 15 },
  ],
  buildings: [
    {
      name: "Willow Market",
      type: "commercial",
      position: { x: 28, y: 12 },
      width: 12,
      height: 12,
      rooms: [], // Open layout
      doorFacing: "south",
      furniture: [
        { type: "shelf", x: 2, y: 2, contents: "groceries" },
        { type: "counter", x: 4, y: 1 },
        { type: "pharmacy", x: 6, y: 3 },
      ],
    },
    {
      name: "Charlotte's Flower Shop",
      type: "commercial",
      position: { x: 14, y: 28 },
      width: 12,
      height: 12,
      rooms: ["display", "storage"], // Custom room types
      doorFacing: "north",
      exteriorType: "tree",
      furniture: [
        { type: "flowerDisplay", x: 2, y: 2 },
        { type: "gardeningTools", x: 4, y: 3 },
        { type: "orderForm", x: 3, y: 4 },
      ],
    },
    // ... other buildings
  ],
};