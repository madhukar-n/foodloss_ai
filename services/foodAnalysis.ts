// 食品分析サービス
// 将来的には Google Cloud Vision API や MobileNet などに置き換え可能

export interface FoodAnalysisResult {
  food_name: string;
  food_type: string;
  expiry_date: string | null;
  package_condition: 'good' | 'moderate' | 'poor';
  food_quality: 'fresh' | 'acceptable' | 'degraded';
  safety_status: 'safe' | 'unsafe';
  confidence: number;
}

// モック AI 分析（デモ用）
// 実本番では Google Cloud Vision API に置き換え
export const analyzeFood = async (
  imageBase64: string
): Promise<FoodAnalysisResult> => {
  // TODO: 実装時に以下のいずれかに置き換え
  // 1. Google Cloud Vision API
  // 2. TensorFlow.js (MobileNet)
  // 3. カスタム ML モデル

  // 現在は模擬的に結果を返す（テスト用）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        food_name: 'Example Food',
        food_type: 'vegetable',
        expiry_date: '2026-03-15',
        package_condition: 'good',
        food_quality: 'fresh',
        safety_status: 'safe',
        confidence: 0.92,
      });
    }, 2000);
  });
};

// Google Cloud Vision API を使用した実装例
// 後でこの関数に置き換える
export const analyzeFoodWithVisionAPI = async (
  imageBase64: string,
  apiKey: string
): Promise<FoodAnalysisResult> => {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION' }, // 賞味期限読取
              { type: 'OBJECT_LOCALIZATION' },
            ],
          },
        ],
      }),
    }
  );

  const result = await response.json();

  // 結果を処理して FoodAnalysisResult に変換
  // TODO: 実装に応じてカスタマイズ
  return {
    food_name: 'Detected Food',
    food_type: 'unknown',
    expiry_date: null,
    package_condition: 'good',
    food_quality: 'fresh',
    safety_status: 'safe',
    confidence: 0.85,
  };
};

// 画像を Base64 に変換
export const convertImageToBase64 = async (
  imageUri: string
): Promise<string> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 画像をアップロードして URL を取得
export const uploadImage = async (
  imageUri: string,
  userId: string,
  supabase: any
): Promise<string> => {
  // Base64 に変換
  const base64 = await convertImageToBase64(imageUri);
  
  // Supabase Storage にアップロード
  const fileName = `${userId}/${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('food_images')
    .upload(fileName, atob(base64), {
      contentType: 'image/jpeg',
    });

  if (error) throw new Error(error.message);

  // 公開 URL を取得
  const { data: urlData } = supabase.storage
    .from('food_images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
