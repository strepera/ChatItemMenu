import axios from "axios";

export let prices = {};
export let npcPrices = {};

axios.get("https://api.hypixel.net/v2/resources/skyblock/items", {
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"
  }
}).then((response) => {
  for (let item of response.data.items) {
    npcPrices[item.id] = item.npc_sell_price?? 0;
  }
}).catch(e => {
  ChatLib.chat("&e[ChatItemMenu] Error fetching from hypixel api");
})

function setPrices() {
  axios.get("https://moulberry.codes/lowestbin.json", {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"
    }
  }).then((response) => {
    for (let key in response.data) {
      prices[key] = {price: response.data[key], type: "auction"};
    }
  }).catch(e => {
    setPrices();
  })

  axios.get("https://api.hypixel.net/v2/skyblock/bazaar", {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0"
    }
  }).then(response => {
    for (let key in response.data.products) {
      let sellPrice = response.data.products[key].quick_status.sellPrice;
      let buyPrice = response.data.products[key].quick_status.buyPrice;
      prices[key.replace(/^ENCHANTMENT_(\S+)_(\d)/, "$1;$2")] = {buy: buyPrice, sell: sellPrice, type: "bazaar"};
    }
  }).catch(e => {
    setPrices();
  });
}

setPrices();

register("step", () => {
  setPrices();
}).setDelay(15 * 60);