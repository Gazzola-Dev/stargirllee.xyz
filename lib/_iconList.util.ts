import {
  Activity,
  AlarmClock,
  Archive,
  ArrowDown,
  ArrowUp,
  Book,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Cloud,
  CloudRain,
  Code,
  Coffee,
  Cog,
  Crown,
  Database,
  Dices,
  Download,
  Earth,
  File,
  Folder,
  Gift,
  Github,
  Globe,
  Heart,
  Home,
  Image,
  Key,
  Laptop,
  Lock,
  Mail,
  Map,
  Moon,
  Music,
  Package,
  Pencil,
  Phone,
  Shield,
  ShoppingCart,
  Smile,
  Star,
  Sun,
  Truck,
  Upload,
  User,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";

export const icons = [
  { name: "Activity", component: Activity },
  { name: "AlarmClock", component: AlarmClock },
  { name: "Archive", component: Archive },
  { name: "ArrowDown", component: ArrowDown },
  { name: "ArrowUp", component: ArrowUp },
  { name: "Book", component: Book },
  { name: "Calendar", component: Calendar },
  { name: "Camera", component: Camera },
  { name: "Check", component: Check },
  { name: "ChevronDown", component: ChevronDown },
  { name: "ChevronUp", component: ChevronUp },
  { name: "CircleCheck", component: CircleCheck },
  { name: "Cloud", component: Cloud },
  { name: "CloudRain", component: CloudRain },
  { name: "Code", component: Code },
  { name: "Coffee", component: Coffee },
  { name: "Cog", component: Cog },
  { name: "Crown", component: Crown },
  { name: "Database", component: Database },
  { name: "Dices", component: Dices },
  { name: "Download", component: Download },
  { name: "Earth", component: Earth },
  { name: "File", component: File },
  { name: "Folder", component: Folder },
  { name: "Gift", component: Gift },
  { name: "Github", component: Github },
  { name: "Globe", component: Globe },
  { name: "Heart", component: Heart },
  { name: "Home", component: Home },
  { name: "Image", component: Image },
  { name: "Key", component: Key },
  { name: "Laptop", component: Laptop },
  { name: "Lock", component: Lock },
  { name: "Mail", component: Mail },
  { name: "Map", component: Map },
  { name: "Moon", component: Moon },
  { name: "Music", component: Music },
  { name: "Package", component: Package },
  { name: "Pencil", component: Pencil },
  { name: "Phone", component: Phone },
  { name: "Shield", component: Shield },
  { name: "ShoppingCart", component: ShoppingCart },
  { name: "Smile", component: Smile },
  { name: "Star", component: Star },
  { name: "Sun", component: Sun },
  { name: "Truck", component: Truck },
  { name: "Upload", component: Upload },
  { name: "User", component: User },
  { name: "Users", component: Users },
  { name: "Wifi", component: Wifi },
  { name: "X", component: X },
  { name: "Zap", component: Zap },
];

export const iconCategories = {
  // Items that can be consumed for effects
  consumables: ["Coffee", "Gift"],

  // Weapons, armor, tools for combat
  weapons: ["Shield", "Zap"],

  // Structures, buildings, architecture
  buildings: ["Home", "Lock"],

  // Animals, creatures, wildlife
  animals: [],

  // Hostile entities, monsters, villains
  enemies: [],

  // Allies, helpers, friendly characters
  friends: ["Smile", "User", "Users"],

  // Natural environment elements
  naturalEnvironment: ["Cloud", "CloudRain", "Earth", "Globe", "Moon", "Sun"],

  // Man-made objects, household items
  householdEnvironment: ["AlarmClock", "Coffee", "Laptop"],

  // Currency, valuables, resources
  currency: ["Crown", "Gift"],

  // Travel, movement, navigation
  travel: ["Map", "Truck"],

  // UI elements, menus, controls
  interfaceElements: [
    "ArrowDown",
    "ArrowUp",
    "Check",
    "ChevronDown",
    "ChevronUp",
    "CircleCheck",
    "Cog",
    "Download",
    "Upload",
    "X",
  ],

  // Magic, fantasy elements
  magic: ["Crown", "Star", "Zap"],

  // Technology, gadgets, devices
  technology: ["Camera", "Laptop", "Phone", "Wifi"],

  // Tools, utilities
  tools: ["Key", "Pencil"],

  // Containers, storage
  containers: ["Archive", "Database", "Folder", "Package", "ShoppingCart"],

  // Multiplayer, social aspects
  social: ["Github", "Heart", "Mail", "Users"],

  // Time, progress, achievements
  progression: ["Activity", "AlarmClock", "Calendar", "Crown", "Star"],

  // Communication, messaging
  communication: ["Mail", "Phone"],

  // Health, healing, status effects
  health: ["Activity", "Heart"],

  // Inventory, collection management
  inventory: ["Archive", "Folder", "Package", "ShoppingCart"],

  // Music, audio
  music: ["Music"],

  // Crafting, creation
  crafting: ["Pencil"],

  // Weather, environmental effects
  weather: ["Cloud", "CloudRain", "Moon", "Sun"],

  // File management, documents
  files: ["File", "Folder"],

  // Puzzle elements, enigmas
  puzzles: ["Dices", "Key", "Lock"],

  // Sports, games, recreational activities
  sports: ["Dices", "Star"],

  // Vehicles, mounts
  vehicles: ["Truck"],

  // Misc game elements
  gameElements: ["Crown", "Dices", "Star"],

  // Cosmetics, appearance items
  cosmetics: ["Crown", "Pencil"],

  // Direction, navigation markers
  directions: ["ArrowDown", "ArrowUp", "ChevronDown", "ChevronUp", "Map"],

  // Security, locks, protection
  security: ["Key", "Lock", "Shield"],
};

/**
 * Type for the icon object structure
 */
type IconObject = {
  name: string;
  component: React.FC<React.SVGProps<SVGSVGElement>>;
};

// Update this to be more specific - use a proper index signature
type IconCategoryKey = keyof typeof iconCategories;

/**
 * Type for the category selections parameter
 */
type CategorySelections = {
  [K in IconCategoryKey]?: number;
};

/**
 * Helper function to get a random item from an array
 * @param array - The array to select from
 * @returns A random item from the array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Helper function to randomly select icons from specified categories
 * @param categorySelections - Object with category names as keys and number of icons to select as values
 * @returns Array of randomly selected icon objects
 */
function getRandomIcons(
  categorySelections?: CategorySelections | null
): IconObject[] {
  // If categorySelections is nullish, return a single random icon from the entire list
  if (!categorySelections) {
    return [getRandomItem(icons)];
  }

  // Validate inputs
  if (typeof categorySelections !== "object") {
    throw new Error("categorySelections must be an object");
  }

  if (!iconCategories || typeof iconCategories !== "object") {
    throw new Error("iconCategories must be an object");
  }

  const result: IconObject[] = [];

  // Create a map of name to icon object for easy lookup
  const iconMap: Record<string, IconObject> = {};
  icons.forEach((icon) => {
    iconMap[icon.name] = icon;
  });

  // Process each category in the selection
  Object.entries(categorySelections).forEach(([category, count]) => {
    // Now TypeScript knows category is a valid key
    const categoryKey = category as IconCategoryKey;

    // This check is now type-safe
    if (!iconCategories[categoryKey]) {
      console.warn(`Category "${category}" not found in iconCategories`);
      return;
    }

    // Get the icon names for this category
    const categoryIcons = iconCategories[categoryKey];

    // Skip empty categories
    if (categoryIcons.length === 0) {
      return;
    }

    // Pick random icons from this category
    for (let i = 0; i < (count ?? 0); i++) {
      const randomIndex = Math.floor(Math.random() * categoryIcons.length);
      const randomIconName = categoryIcons[randomIndex];

      // Find the corresponding icon object
      const iconObject = iconMap[randomIconName];

      // Only add if the icon exists in the icon array
      if (iconObject) {
        result.push(iconObject);
      } else {
        // If icon not found, try another one (optional)
        i--; // Retry for this iteration
      }
    }
  });

  // If no icons were selected from the specified categories, return a random icon
  if (result.length === 0) {
    return [getRandomItem(icons)];
  }

  return result;
}

export default getRandomIcons;
