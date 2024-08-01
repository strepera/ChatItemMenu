import GuiHelper from "./gui.js";

let displayManager = new GuiHelper();

let positionData = FileLib.read("ChatItemMenu", "player_data/guiposition.json");
if (!positionData) {
  positionData = {};
}
else {
  positionData = JSON.parse(positionData);
}

register("step", () => {
  FileLib.write("ChatItemMenu", "player_data/guiposition.json", JSON.stringify(positionData));
}).setDelay(10)

register("command", () => displayManager.open()).setName("cimlocation");

function addDisplay(name, texts, rects, x, y) {

  if (!positionData[name]) {
    positionData[name] = {
      x: x,
      y: y
    }
  }
  
  texts.forEach(text => {
    displayManager.addText({
      text: text.text,
      x: positionData[name].x*Renderer.screen.getWidth(),
      y: positionData[name].y*Renderer.screen.getHeight(),
      unhover: (textObj) => {
        if (displayManager.isOpen()) {
          textObj.x = positionData[name].x;
          textObj.y = positionData[name].y;
        }
      }
    })
  })

  rects.forEach(rect => {
    displayManager.addRectangle({
      color: rect.color,
      x: positionData[name].x*Renderer.screen.getWidth(),
      y: positionData[name].y*Renderer.screen.getHeight(),
      w: rect.w,
      h: rect.h,
      click: (rectObj, mouseX, mouseY) => {
        rectObj.initialMouseX = mouseX;
        rectObj.initialMouseY = mouseY;
      },
      drag: (rectObj, mouseX, mouseY, button) => {
        if (displayManager.isOpen()) {
          let rectX = rectObj.x*Renderer.screen.getWidth();
          let rectY = rectObj.y*Renderer.screen.getHeight();
          let xOffset = mouseX - (rectObj.initialMouseX?? 0);
          let yOffset = mouseY - (rectObj.initialMouseY?? 0);
          rectObj.x = (rectX+xOffset)/Renderer.screen.getWidth();
          rectObj.y = (rectY+yOffset)/Renderer.screen.getHeight();
          rectObj.initialMouseX = mouseX;
          rectObj.initialMouseY = mouseY;
          positionData[name] = {
            x: (rectX+xOffset)/Renderer.screen.getWidth(),
            y: (rectY+yOffset)/Renderer.screen.getHeight()
          }
        }
      }
    })
  })

}

export { addDisplay, positionData }