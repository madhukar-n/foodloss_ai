import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/constants/supabase';

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// 認証ユーザー取得
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// プロバイダー側：食品データを保存
export const saveFoodItem = async (
  userId: string,
  foodData: {
    food_name: string;
    food_type: string;
    expiry_date?: string;
    package_condition: string;
    food_quality: string;
    safety_status: 'safe' | 'unsafe';
    location: string;
    image_url?: string;
  }
) => {
  const { data, error } = await supabase
    .from('food_items')
    .insert([{ user_id: userId, ...foodData }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// 食品在庫を取得（消費者側用）
export const getAvailableFoodItems = async () => {
  const { data, error } = await supabase
    .from('food_inventory')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// 食品在庫を更新
export const updateFoodInventory = async (
  foodId: string,
  updates: Record<string, any>
) => {
  const { data, error } = await supabase
    .from('food_inventory')
    .update(updates)
    .eq('id', foodId)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// ユーザー登録
export const registerUser = async (
  email: string,
  password: string,
  userType: 'provider' | 'consumer',
  location: string
) => {
  // Auth ユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  // ユーザープロフィール作成
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          user_type: userType,
          location,
        },
      ]);

    if (profileError) throw new Error(profileError.message);
  }

  return authData;
};

// ユーザーログイン
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

// ユーザーログアウト
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
