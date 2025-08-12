// Constants for the Image Text Composer

export const GOOGLE_FONTS = [
  "Arial",
  "Roboto", 
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Source Sans Pro",
  "Raleway",
  "PT Sans",
  "Lora",
  "Merriweather",
  "Playfair Display",
  "Dancing Script",
  "Pacifico",
  "Lobster",
  "Great Vibes",
  "Satisfy",
  "Shadows Into Light",
  "Amatic SC",
];

export const FONT_WEIGHTS = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

export const DEFAULT_CANVAS_SIZE = {
  width: 800,
  height: 600,
};

export const DEFAULT_TEXT_LAYER = {
  text: "New Text",
  fontSize: 24,
  fontFamily: "Arial",
  fontWeight: "400",
  color: "#000000",
  opacity: 100,
  alignment: "center" as const,
  rotation: 0,
  visible: true,
  locked: false,
};

export const HISTORY_LIMIT = 20;

export const LOCAL_STORAGE_KEY = "imageTextComposer";