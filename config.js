import { @Vigilant, @SwitchProperty, @TextProperty, @CheckboxProperty, @ButtonProperty, @SelectorProperty, @SliderProperty, @ColorProperty, @PercentSliderProperty, Color} from "../Vigilance/index";

@Vigilant("ChatItemMenu")
class Settings {
  @TextProperty({
    name: "Search Prefix",
    description: "Use this prefix to search for items in chat. Include a : at the end of your prefix.",
    category: "General"
  })
  prefix = "s:" 

  constructor() {
      this.initialize(this);
      this.setCategoryDescription("General", "General customization settings")
  }
}

const settings = new Settings();
export default settings;
