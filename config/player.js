export let ModifyPlayer = [
  {
    type: "switch",
    name: "Apply To All Players",
    description: "Applies changes to every player",
    placeholder: false
  },
  {
    type: "switch",
    name: "Player Height Toggle",
    description: "Toggles changing player's height",
    placeholder: false
  },
  {
    type: "text",
    name: "Player Height",
    description: "Changes player's height",
    placeholder: "1"
  },
  {
    type: "switch",
    name: "Player Spin Toggle",
    description: "Toggles spinning on and off",
    placeholder: false
  },
  {
    type: "slider",
    name: "Player Spin",
    description: "How fast the player spins",
    placeholder: 50
  }
]