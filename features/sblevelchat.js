let actionBarCount = 0;
let lastMessage = "";

register("actionBar", (string, event) => {
  if (match = string.match(/.*(\+\d+) SkyBlock XP (\([^()]+\)) (\(\d+\/\d+\)).*/)) {
    if (actionBarCount >= 9 || lastMessage != string) {
      actionBarCount = 0;
    }
    if (actionBarCount == 0) {
      ChatLib.chat(`&b${match[1]} SkyBlock XP &7${match[2]} &b${match[3]}`);
    }
    lastMessage = string;
    actionBarCount++;
  }
}).setCriteria("${message}")