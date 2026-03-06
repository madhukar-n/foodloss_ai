export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
};

export const SUPABASE_TABLES = {
  FOOD_ITEMS: 'food_items',
  USERS: 'users',
  FOOD_INVENTORY: 'food_inventory',
};
