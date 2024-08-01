import { Settings } from '../SimpleConfig/index.js';
import { Search } from './config/search.js';
import { Overlay } from './config/overlay.js';
import { DwarvenMines } from './config/dwarvenmines.js';
import { CrystalHollows } from './config/crystalhollows.js';
import { Tooltip } from './config/tooltip.js';
import { Equipment } from './config/equipment.js';
import { Dungeons } from './config/dungeons.js';
import { FairySouls } from './config/fairysouls.js';
import { Garden } from './config/garden.js';
import { Buttons } from './config/buttons.js';
import { Waypoints } from './config/waypoints.js';
import { PartyCommands } from './config/partycommands.js';
import { ModifyPlayer } from './config/player.js';

export let settings = new Settings("ChatItemMenu");

settings.addCategory("Search", Search);

settings.addCategory("Equipment", Equipment);

settings.addCategory("Overlay", Overlay);

settings.addCategory("Dwarven Mines", DwarvenMines);

settings.addCategory("Crystal Hollows", CrystalHollows);

settings.addCategory("Tooltip", Tooltip);

settings.addCategory("Dungeons", Dungeons);

settings.addCategory("Fairy Souls", FairySouls);

settings.addCategory("Garden", Garden);

settings.addCategory("Buttons", Buttons);

settings.addCategory("Waypoints", Waypoints);

settings.addCategory("Commands", PartyCommands);

settings.addCategory("Player", ModifyPlayer);

settings.addSwitch({
  name: "Fruit Digging Helper",
  description: "Highlights which blocks are safe",
  category: "Carnival",
  placeholder: true
})

settings.addButton({
  name: "Open GUI Location Menu",
  description: "Drag squares to change position",
  category: "GUI Location",
  activate: () => {
    ChatLib.command("cimlocation", true);
  }
})