const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField");

export default class GuiHelper {

  constructor() {
    this.gui = new Gui();
    this.strings = [];
    this.rects = [];
    this.textinputs = [];
    this.items = [];
    this.sliders = [];

    let height = Renderer.screen.getHeight();
    let width = Renderer.screen.getWidth();
    this.gui.registerOpened(() => {
      let newH = Renderer.screen.getHeight();
      let newW = Renderer.screen.getWidth();
      if (height != newH || width != newW) {
        height = newH;
        width = newW;

        this.textinputs.forEach(input => {
          let newX = input.x*(Renderer.screen.getWidth() / input.current_screen_width);
          let newY = input.y*(Renderer.screen.getHeight() / input.current_screen_height);

          input.box = new GuiTextField(0, Client.getMinecraft().field_71466_p, newX, newY, input.w, input.h);
        })

      }
    })

    this.gui.registerClosed(() => {

      this.textinputs.forEach(input => {
        input.box.func_146195_b(false);
      })

    })
    
    this.gui.registerDraw(() => {

      this.rects.forEach(rect => {

        let x = rect.x*Renderer.screen.getWidth();
        let y = rect.y*Renderer.screen.getHeight();
        let w = rect.w*Renderer.screen.getWidth();
        let h = rect.h*Renderer.screen.getHeight();

        Renderer.drawRect(rect.color, x, y, w, h);

        let mouseX = Client.getMouseX();
        let mouseY = Client.getMouseY();
        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
          rect.hover(rect, mouseX, mouseY);
        }
        else {
          rect.unhover(rect, mouseX, mouseY);
        }

      })

      this.sliders.forEach(slider => {

        let x = slider.x*Renderer.screen.getWidth();
        let y = slider.y*Renderer.screen.getHeight();
        let w = slider.w*Renderer.screen.getWidth();
        let h = slider.h*Renderer.screen.getHeight();

        Renderer.drawRect(slider.color, x, y, w, h);
        Renderer.drawRect(slider.color2, x + (slider.percent/100)*w - h/2, y, h, h);

        let mouseX = Client.getMouseX();
        let mouseY = Client.getMouseY();
        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
          slider.hover(slider, mouseX, mouseY);
        }
        else {
          slider.unhover(slider, mouseX, mouseY);
        }

      })

      this.items.forEach(item => {

        let x = item.x()*Renderer.screen.getWidth();
        let y = item.y()*Renderer.screen.getHeight();

        item.item.draw(x, y, item.scale);

        let mouseX = Client.getMouseX();
        let mouseY = Client.getMouseY();
        if (mouseX > x && mouseX < x+16*item.scale && mouseY > y && mouseY < y+16*item.scale) {
          item.hover(item, mouseX, mouseY);
        }
        else {
          item.unhover(item, mouseX, mouseY);
        }

      })

      this.strings.forEach(string => {

        Renderer.drawString(string.text, string.x*Renderer.screen.getWidth(), string.y*Renderer.screen.getHeight(), true);

        let lines = string.text.split("\n");
        lines.forEach((line, index) => {
          let width = Renderer.getStringWidth(line);
          let height = 10;
          let mouseX = Client.getMouseX();
          let mouseY = Client.getMouseY();
          let x = string.x*Renderer.screen.getWidth();
          let y = string.y*Renderer.screen.getHeight();
          if (mouseX > x && mouseX < x + width && mouseY > y+index*height && mouseY < y+index*height+height) {
            string.hover(string, mouseX, mouseY, line);
          }
          else {
            string.unhover(string, mouseX, mouseY, line);
          }
        })

      })

      this.textinputs.forEach(input => {
        input.box.func_146194_f();
      })

    })

    this.gui.registerClicked((mouseX, mouseY, button) => {

      this.strings.forEach(string => {

        let lines = string.text.split("\n");
        lines.forEach((line, index) => {
          let width = Renderer.getStringWidth(line);
          let height = 10;
          let x = string.x*Renderer.screen.getWidth();
          let y = string.y*Renderer.screen.getHeight();
          if (mouseX > x && mouseX < x + width && mouseY > y+index*height && mouseY < y+index*height+height) {
            string.click(string, mouseX, mouseY, button, line);
          }
        })

      })

      this.rects.forEach(rect => {

        let x = rect.x*Renderer.screen.getWidth();
        let y = rect.y*Renderer.screen.getHeight();
        let w = rect.w*Renderer.screen.getWidth();
        let h = rect.h*Renderer.screen.getHeight();

        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
          rect.click(rect, mouseX, mouseY, button);
        }

      })

      this.sliders.forEach(slider => {

        let x = slider.x*Renderer.screen.getWidth();
        let y = slider.y*Renderer.screen.getHeight();
        let w = slider.w*Renderer.screen.getWidth();
        let h = slider.h*Renderer.screen.getHeight();

        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
          slider.percent = (mouseX - x)/w * 100;
          slider.click(slider, mouseX, mouseY, button);
        }
        else if (mouseX < x && mouseX > x-32 && mouseY > y && mouseY < y+h) {
          slider.percent = 0;
          slider.click(slider, mouseX, mouseY, button);
        }
        else if (mouseX > x+w && mouseX < x+w+32 && mouseY > y && mouseY < y+h) {
          slider.percent = 100;
          slider.click(slider, mouseX, mouseY, button);
        }

      })

      this.items.forEach(item => {

        let x = item.x()*Renderer.screen.getWidth();
        let y = item.y()*Renderer.screen.getHeight();

        if (mouseX > x && mouseX < x+16*item.scale && mouseY > y && mouseY < y+16*item.scale) {
          item.click(item, mouseX, mouseY, button);
        }

      })

      this.textinputs.forEach(input => {

        input.box.func_146192_a(mouseX, mouseY, button);
        if (mouseX > input.x && mouseX < input.x + input.w && mouseY > input.y && mouseY < input.y + input.h) {
          input.click(input.box, mouseX, mouseY, button);
        }

      })
    })

    let lastSlider;
    this.gui.registerMouseDragged((mouseX, mouseY, button) => {

      this.strings.forEach(string => {

        let lines = string.text.split("\n");
        lines.forEach((line, index) => {
          let width = Renderer.getStringWidth(line);
          let height = 10;
          let x = string.x*Renderer.screen.getWidth();
          let y = string.y*Renderer.screen.getHeight();
          if (mouseX > x && mouseX < x + width && mouseY > y+index*height && mouseY < y+index*height+height) {
            string.drag(string, mouseX, mouseY, button, line);
          }
        })

      })

      this.rects.forEach(rect => {

        let x = rect.x*Renderer.screen.getWidth();
        let y = rect.y*Renderer.screen.getHeight();
        let w = rect.w*Renderer.screen.getWidth();
        let h = rect.h*Renderer.screen.getHeight();

        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
          rect.drag(rect, mouseX, mouseY, button);
        }

      })

      this.sliders.forEach(slider => {

        let x = slider.x*Renderer.screen.getWidth();
        let y = slider.y*Renderer.screen.getHeight();
        let w = slider.w*Renderer.screen.getWidth();
        let h = slider.h*Renderer.screen.getHeight();

        let isNotLastSlider = true;
        if (lastSlider) {
          isNotLastSlider = lastSlider.x != slider.x || lastSlider.y != slider.y || lastSlider.w != slider.w || lastSlider.h != slider.h || lastSlider.color != slider.color || lastSlider.color2 != slider.color2;
        }

        if (mouseX > x && mouseX < x+w && ((mouseY > y && mouseY < y+h) || !isNotLastSlider)) {
          if (lastSlider && isNotLastSlider) {
            return;
          }
          lastSlider = slider;

          slider.percent = (mouseX - x)/w * 100;
          slider.drag(slider, mouseX, mouseY, button);
        }

      })

      this.items.forEach(item => {

        let x = item.x()*Renderer.screen.getWidth();
        let y = item.y()*Renderer.screen.getHeight();

        if (mouseX > x && mouseX < x+16*item.scale && mouseY > y && mouseY < y+16*item.scale) {
          item.drag(item, mouseX, mouseY, button);
        }

      })

      this.textinputs.forEach(input => {

        input.box.func_146192_a(mouseX, mouseY, button);
        if (mouseX > input.x && mouseX < input.x + input.w && mouseY > input.y && mouseY < input.y + input.h) {
          input.drag(input.box, mouseX, mouseY, button);
        }

      })
    })

    this.gui.registerMouseReleased(() => {
      lastSlider = null;
    })

    this.gui.registerKeyTyped((char, keyCode) => {

      this.textinputs.forEach(input => {
        if (input.box.func_146206_l() ) {
          input.box.func_146201_a(char, keyCode);
          input.value = input.box.func_146179_b();
          input.type(input.box, char, keyCode);
        }
      })

    })

  }

  addText(data) {
    this.strings.push({
      text: data.text,
      x: data.x/Renderer.screen.getWidth(),
      y: data.y/Renderer.screen.getHeight(),
      click: data.click?? emptyFunc,
      hover: data.hover?? emptyFunc,
      unhover: data.unhover?? emptyFunc,
      drag: data.drag?? emptyFunc
    })
  }

  addRectangle(data) {
    this.rects.push({
      color: data.color,
      x: data.x/Renderer.screen.getWidth(),
      y: data.y/Renderer.screen.getHeight(),
      w: data.w/Renderer.screen.getWidth(),
      h: data.h/Renderer.screen.getHeight(),
      click: data.click?? emptyFunc,
      hover: data.hover?? emptyFunc,
      unhover: data.unhover?? emptyFunc,
      drag: data.drag?? emptyFunc
    })
  }

  addTextInput(data) {
    this.textinputs.push({
      value: data.value,
      x: data.x,
      y: data.y,
      w: data.w,
      h: data.h,
      click: data.click?? emptyFunc,
      hover: data.hover?? emptyFunc,
      unhover: data.unhover?? emptyFunc,
      drag: data.drag?? emptyFunc,
      type: data.type?? emptyFunc,
      box: new GuiTextField(0, Client.getMinecraft().field_71466_p, data.x, data.y, data.w, data.h),
      current_screen_height: Renderer.screen.getHeight(),
      current_screen_width: Renderer.screen.getWidth()
    })
  }

  addItem(data) {
    this.items.push({
      item: data.item,
      x: () => { return data.x()/Renderer.screen.getWidth() },
      y: () => { return data.y()/Renderer.screen.getHeight() },
      scale: data.scale,
      click: data.click?? emptyFunc,
      hover: data.hover?? emptyFunc,
      unhover: data.unhover?? emptyFunc,
      drag: data.drag?? emptyFunc
    })
  }

  addSlider(data) {
    this.sliders.push({
      color: data.color,
      color2: data.color2,
      percent: data.percent,
      x: data.x/Renderer.screen.getWidth(),
      y: data.y/Renderer.screen.getHeight(),
      w: data.w/Renderer.screen.getWidth(),
      h: data.h/Renderer.screen.getHeight(),
      click: data.click?? emptyFunc,
      hover: data.hover?? emptyFunc,
      unhover: data.unhover?? emptyFunc,
      drag: data.drag?? emptyFunc
    })
  }

  open() {
    this.gui.open();
  }

  close() {
    this.gui.close();
  }

  isOpen() {
    return this.gui.isOpen();
  }
}

const emptyFunc = () => {};