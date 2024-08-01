export let Buttons = [
  {
    type: "switch",
    name: "Add Inventory Button Button",
    description: "Shows the button that lets you add an inventory button",
    placeholder: true
  },
  {
    type: "button",
    name: "Open Button Creation GUI",
    activate: () => {
      ChatLib.command("cimopentabgui", true);
    }
  }
]