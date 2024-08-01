export let Garden = [
  {
    type: "switch",
    name: "Left Click Hotkey",
    description: "Change in minecraft controls to any key",
    placeholder: true
  },
  {
    type: "switch",
    name: "Pest Helper",
    description: "Use keybind to teleport to plot with pests and draw cubes around plots with pests",
    placeholder: true,
    varname: "pestHelper"
  },
  {
    type: "switch",
    name: "Visitor Display",
    description: "Displays visitors and their required items",
    placeholder: true
  },
  {
    type: "switch",
    name: "Block declining unique visitors",
    placeholder: true
  },
  {
    type: "switch",
    name: "Block Declining Visitors with Rare Rewards",
    description: "Sends a message and cancels declining visitors with grass, music rune, dedication 4 or green bandana",
    placeholder: true
  },
  {
    type: "switch",
    name: "Lock Mouse Sensitivity",
    description: "Locks mouse sensitivity while holding any farming tool",
    placeholder: true
  },
  {
    type: "switch",
    name: "Fortune Display",
    description: "Displays your true farming fortune and jacob weight",
    placeholder: true,
    varname: "fortuneDisplay"
  },
  {
    type: "switch",
    name: "Contest Display",
    description: "Shows upcoming contests",
    placeholder: true,
    varname: "contestDisplay"
  },
  {
    type: "switch",
    name: "Always Show Contests",
    description: "Shows upcoming contests outside of the garden",
    placeholder: false,
    varname: "alwaysShowContests"
  }
]