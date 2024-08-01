import { locraw } from "../utils/locraw.js";
import { settings } from "../config.js";
import { getLongest, when } from "../utils/utils.js";
import { positionData, addDisplay } from "../utils/display.js";
let Settings = settings.settings;

const visitorWants = JSON.parse(FileLib.read("ChatItemMenu", "data/visitorwants.json"));

const importantItems = [
  "Dedication IV",
  "Dedication 4",
  "Green Bandana",
  "Overgrown Grass",
  "Music Rune I",
  "Music Rune 1"
];

let currentVisitors = {};

register("guiOpened", () => {
  Client.scheduleTask(2, () => {
    if (locraw.mode != "garden") return;
    let container = Player.getContainer();
    if (!container) return;
  
    const rewardsInfo = container.getStackInSlot(29);
    if (!rewardsInfo) return;
    if (!rewardsInfo.getName().includes("Accept Offer")) return;

    const visitorInfo = container.getStackInSlot(13);
    let visitorName = visitorInfo.getName();
    currentVisitors[visitorName] = {
      timesAccepted: 0,
      requirements: []
    }
    for (let line of visitorInfo.getLore()) {
      if (match = ChatLib.removeFormatting(line).match(/Offers Accepted: (\d+)/)) {
        currentVisitors[visitorName].timesAccepted = match[1];
      }
    }
  
    let rewardsInfoLore = rewardsInfo.getLore();
    rewardsInfoLore.forEach((line, index) => {
      if (ChatLib.removeFormatting(line).includes("Items Required:")) {
        for (let i = index+1; i < rewardsInfoLore.length; i++) {
          if (!ChatLib.removeFormatting(rewardsInfoLore[i]).trim()) return;
          currentVisitors[visitorName].requirements.push(rewardsInfoLore[i]);
        }
      }
    })
  })
})

let visitorString = "&b&lVisitors";
register("step", () => {
  if (locraw.mode != "garden") return;
  if (!Player.getPlayer()) return;
  if (!TabList?.getNames()) return;
  let lines = TabList.getNames();
  lines.forEach((line, index) => {
    if (match = ChatLib.removeFormatting(line).match(/Visitors: \((\d+)\)/)) {
      visitorString = `&b&lVisitors &r&7(${match[1]})`;
      for (let i = lines.indexOf(line)+1; i < lines.length; i++) {
        if (!ChatLib.removeFormatting(lines[i]).trim()) return;
        let name = lines[i].replace(/§r /g, "").replace(/^§r/, "§f").replace(/§r$/, "");
        if (!currentVisitors[name]) {
          if (!visitorWants[name]) return;
          currentVisitors[name] = {
            timesAccepted: "?",
            requirements: visitorWants[name].map(line => "&r &r" + line)
          }
        }
      }
    }
  })
}).setDelay(1)

let index = 0;
when(() => locraw.mode == "garden" && Object.keys(currentVisitors).length !== 0 && settings["Visitor Display"], 
  register("renderOverlay", () => {
    let longest = 0;
    for (let visitor in currentVisitors) {
      let array = currentVisitors[visitor].requirements.slice();
      array.push(`${visitor.replace(/§([^f])/, "§$1§l")} &7(${currentVisitors[visitor].timesAccepted})`);
      let length = getLongest(array).width;
      if (length > longest) {
        longest = length;
      }
    }
    Renderer.drawRect(Renderer.color(0, 0, 0, 150), positionData.visitorList.x*Renderer.screen.getWidth()-4, positionData.visitorList.y*Renderer.screen.getHeight()-4, longest+8, index*9+8);
    Renderer.drawString(visitorString, positionData.visitorList.x*Renderer.screen.getWidth()-2, positionData.visitorList.y*Renderer.screen.getHeight()-2, true);
    index = 1;
    for (let visitor in currentVisitors) {
      Renderer.drawString(`${visitor.replace(/§([^f])/, "§$1§l")} &7(${currentVisitors[visitor].timesAccepted})`, positionData.visitorList.x*Renderer.screen.getWidth(), positionData.visitorList.y*Renderer.screen.getHeight()+index*9, true);
      index++;
      for (let requirement of currentVisitors[visitor].requirements) {
        Renderer.drawString(requirement, positionData.visitorList.x*Renderer.screen.getWidth(), positionData.visitorList.y*Renderer.screen.getHeight()+index*9, true);
        index++;
      }
    }
  })
)

register("chat", (message) => {
  if (match = message.match(/&a&r(.+) &r&ehas arrived on your &r&bGarden&r&e!&r/)) {
    let name = match[1].replaceAll("&", "§f§");
    if (currentVisitors[name]) return;
    currentVisitors[name] = {
      timesAccepted: "?",
      requirements: visitorWants[name].map(line => "&r &r" + line)
    }
  }
}).setCriteria("&r${message}")

addDisplay("visitorList", 
  [
    {
      text: "Visitor List"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0,
  y = 0.2
)

register("guiMouseClick", (_, __, ___, gui, event) => {
  if (locraw.mode != "garden") return;
  let container = Player.getContainer();
  if (!container) return;

  if (!gui?.getSlotUnderMouse()) return;

  const confirmItem = new Slot(gui.getSlotUnderMouse())?.getItem();
  if (!confirmItem) return;
  if (!confirmItem.getName().includes("Refuse Offer")) return;

  const visitorInfo = container.getStackInSlot(13);
  if (currentVisitors[visitorInfo.getName()]) {
    delete currentVisitors[visitorInfo.getName()];
  }
  if (Settings.get("Block declining unique visitors")) {
    for (let line of visitorInfo.getLore()) {
      if (match = ChatLib.removeFormatting(line).match(/Offers Accepted: (\d+)/)) {
        if (match[1] === 0) {
          cancel(event);
          Client.currentGui.close();
          ChatLib.chat(`&a[ChatItemMenu] Blocked declining unique visitor`);
        }
      }
    }
  }

  if (Settings.get("Block Declining Visitors with Rare Rewards")) {
    const rewardsInfo = container.getStackInSlot(29);
    for (let line of rewardsInfo.getLore()) {
      for (let item of importantItems) {
        if (ChatLib.removeFormatting(line).includes(item)) {
          cancel(event);
          Client.currentGui.close();
          ChatLib.chat(`&a[ChatItemMenu] Blocked declining visitor with &f${item}`);
        }
      }
    }
  }
})
