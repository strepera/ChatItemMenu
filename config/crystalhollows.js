export let CrystalHollows = [
  {
    type: "switch",
    name: "Treasure Chest Helper",
    description: "Draws a line to treasure chests (doesn't work with patcher parallax fix)",
    placeholder: true
  },
  {
    type: "button",
    name: "Set Jungle Cheese Waypoint",
    description: "Set jungle cheese waypoint based on current position (requires skytils)",
    activate: () => {
      ChatLib.command(`sthw set ${Math.floor(Player.getX() + 61)} ${Math.floor(Player.getY() - 44)} ${Math.floor(Player.getZ() + 18)} Jungle Armadillo Cheese`, true)
    }
  }
]