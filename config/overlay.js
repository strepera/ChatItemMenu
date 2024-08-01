export let Overlay = [
  {
    type: "switch",
    name: "Pet Overlay",
    description: "Displays info about your equipped pet",
    placeholder: true
  },
  {
    type: "switch",
    name: "Pickup Log",
    description: "Displays items added and removed from your inventory",
    placeholder: true
  },
  {
    type: "switch",
    name: "Etherwarp Overlay",
    description: "Highlights the block you will teleport to when using etherwarp",
    placeholder: true
  },
  {
    type: "colour",
    name: "Etherwarp Overlay Colour",
    description: "Colour of the etherwarp block overlay",
    placeholder: [255, 0, 0, 155]
  },
  {
    type: "switch",
    name: "Gyrokinetic Wand Overlay",
    description: "Renders a circle that represents your gyro range",
    placeholder: true
  },
  {
    type: "colour",
    name: "Gyro Overlay Colour",
    description: "Changes the colour of the gyro overlay circle",
    placeholder: [255, 0, 0, 155]
  },
  {
    type: "switch",
    name: "Fire Veil Cooldown Display",
    description: "Shows your fire veil cooldown under your cursor",
    placeholder: true
  }
]