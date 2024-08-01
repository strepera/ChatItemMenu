import { settings } from '../config.js';
import { locraw } from '../utils/locraw.js';
import { Keybind } from "KeybindFix";
let Settings = settings.settings;

const leftClickReplacement = new Keybind("Replacement Left Click", 44, "ChatItemMenu");
const punchKey = Client.getKeyBindFromDescription("key.attack");

leftClickReplacement.registerKeyDown(() => {
  if (locraw.mode != "garden" || !Settings.get("Left Click Hotkey")) return;
  punchKey.setState(true);
})

leftClickReplacement.registerKeyRelease(() => {
  if (locraw.mode != "garden" || !Settings.get("Left Click Hotkey")) return;
  punchKey.setState(false);
})