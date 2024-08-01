export let PartyCommands = [
  {
    type: "switch",
    name: "Self Commands",
    description: "If enabled, only you can use commands",
    placeholder: false
  },
  {
    type: "switch",
    name: "Playtime Command",
    description: "Sends playtime in chat with !playtime",
    placeholder: true
  },
  {
    type: "switch",
    name: "Time Command",
    description: "Sends your local time in chat with !time",
    placeholder: true
  },
  {
    type: "switch",
    name: "PT me Command",
    description: "Transfers the party to whoever says !ptme",
    placeholder: false
  }
]