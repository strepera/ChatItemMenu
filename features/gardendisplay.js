import { locraw } from "../utils/locraw";
import { when, getLongest, getTimeLeft, getItemFromNBT } from "../utils/utils.js";
import { addDisplay, positionData } from "../utils/display.js";
import { settings } from "../config.js";
import axios from 'axios';

const items = {
  "Wheat": new Item("minecraft:wheat"),
  "Carrot": new Item("minecraft:carrot"),
  "Potato": new Item("minecraft:potato"),
  "Pumpkin": new Item("minecraft:pumpkin"),
  "Sugar Cane": new Item("minecraft:reeds"),
  "Melon": new Item("minecraft:melon"),
  "Cactus": new Item("minecraft:cactus"),
  "Cocoa Beans": getItemFromNBT('{id:"minecraft:dye",Count:1b,tag:{HideFlags:254,display:{Lore:[0:""],Name:"Cocoa Beans"},ExtraAttributes:{id:"INK_SACK:3"}},Damage:3s}'),
  "Mushroom": new Item("minecraft:red_mushroom"),
  "Nether Wart": new Item("minecraft:nether_wart"),
}

let weight = 0;
let fortune = 0;
let cropType = "Farming";
let contests = [];
when(() => settings.fortuneDisplay && locraw.mode == "garden",
  register("step", () => {
    fortune = 0;
    for (let line of TabList.getNames()) {
      if (match = line.match(/§r (.+) Fortune: §r§6☘(\d+)§r/)) {
        cropType = match[1];
        fortune += Number(match[2]);
      }
    }
  }).setDelay(1)
)

axios.get(`https://api.elitebot.dev/Weight/${Player.getUUID()}`).then(response => {
  weight = Math.floor(response.data.profiles.find(profile => profile.profileId == response.data.selectedProfileId).totalWeight);
})
when(() => settings.fortuneDisplay && locraw.mode == "garden",
  register("step", () => {
    axios.get(`https://api.elitebot.dev/Weight/${Player.getUUID()}`).then(response => {
      weight = Math.floor(response.data.profiles.find(profile => profile.profileId == response.data.selectedProfileId).totalWeight);
    })
  }).setDelay(10 * 60)
)

function setContests() {
  axios.get("https://api.elitebot.dev/contests/at/now").then(response => {
    let now = new Date();
    contests = [];
  
    for (let time in response.data.contests) {
      let contestTime = new Date(time * 1000);
      if (contestTime > now - 1200000) {
        contests.push({
          crops: response.data.contests[time],
          time: contestTime
        });
      }
    }
  }).catch(e => {
    ChatLib.chat("&c[ChatItemMenu] Error loading contests: &f" + e.response.data.error);
  })
}

setContests();
register("step", () => {
  setContests();
}).setDelay(60 * 60)

when(() => settings.fortuneDisplay && locraw.mode == "garden",
  register("renderOverlay", () => {
    let array = [`&r &r&6${cropType} Fortune &f${fortune}`, `&r &r&6Jacob Weight &f${weight}`];
    Renderer.drawRect(Renderer.color(0, 0, 0, 150), positionData.fortuneGui.x*Renderer.screen.getWidth(), positionData.fortuneGui.y*Renderer.screen.getHeight(), getLongest(array).width+4, array.length*9+8);
    array.forEach((line, index) => {
      Renderer.drawString(line, positionData.fortuneGui.x*Renderer.screen.getWidth(), positionData.fortuneGui.y*Renderer.screen.getHeight()+4+index*9, true);
    })
  })
)

when(() => settings.contestDisplay && locraw.gametype == "SKYBLOCK" && (locraw.mode == "garden" || settings.alwaysShowContests),
  register("renderOverlay", () => {
    let array = ["&r &r&9&lNext 6 Contests"];
    contests.slice(0, 6).forEach((contest, contestIndex) => {
      contest.crops.forEach((crop, index) => {
        items[crop].draw(positionData.contestGui.x*Renderer.screen.getWidth() + index*16+3, positionData.contestGui.y*Renderer.screen.getHeight()+12+contestIndex*9, 0.65);
      })
      let time = (contest.time - Date.now())/1000;
      let prefix = "Starts ";
      if (time < 0) {
        time = 1200 + time;
        prefix = "Ends ";
      }
      array.push(`&r &r &r &r &r &r &r &r &r &r &r &r &7(${prefix}${getTimeLeft(time)})`);
    })
    Renderer.drawRect(Renderer.color(0, 0, 0, 150), positionData.contestGui.x*Renderer.screen.getWidth(), positionData.contestGui.y*Renderer.screen.getHeight(), getLongest(array).width+4, array.length*9+8);
    array.forEach((line, index) => {
      Renderer.drawString(line, positionData.contestGui.x*Renderer.screen.getWidth(), positionData.contestGui.y*Renderer.screen.getHeight()+4+index*9, true);
    })
  })
)

addDisplay(
  "fortuneGui",
  [
    {
      text: "Farming Fortune"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0.6,
  y = 0.1
)

addDisplay(
  "contestGui",
  [
    {
      text: "Upcoming Contests"
    }
  ],
  [
    {
      color: Renderer.color(0, 0, 0, 150),
      w: 40,
      h: 40
    }
  ],
  x = 0.6,
  y = 0.2
)