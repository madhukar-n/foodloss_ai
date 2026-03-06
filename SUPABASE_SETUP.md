# Supabase + AI 画像認識 実装ガイド

## セットアップ手順

### Step 1: Supabase プロジェクト作成（5分）

1. https://supabase.com にアクセス
2. 「Start Your Project」→ GitHub でログイン
3. 新規プロジェクト作成:
   - **Project name**: `foodloss-ai`
   - **Region**: `Tokyo (ap-northeast-1)` 推奨
   - **Password**: セキュアなパスワード設定

### Step 2: データベース テーブル作成（3分）

Supabase ダッシュボード → **SQL Editor** で以下を実行:

```sql
-- 食品提供データテーブル
CREATE TABLE food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  food_name text NOT NULL,
  food_type text NOT NULL,
  expiry_date date,
  package_condition text,
  food_quality text,
  safety_status text,
  location text,
  quantity integer DEFAULT 1,
  image_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ユーザーテーブル
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  user_type text NOT NULL,
  location text,
  created_at timestamp DEFAULT now()
);

-- 食品在庫テーブル（子ども食堂向け）
CREATE TABLE food_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_name text NOT NULL,
  food_type text NOT NULL,
  location text NOT NULL,
  quantity integer NOT NULL,
  available_date date,
  status text DEFAULT 'available',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Storage bucket (画像保存用)
-- ダッシュボード → Storage → 右のメニューで Create New Bucket
-- Bucket name: food_images
-- Make it Public: ON
```

### Step 3: API キー取得（1分）

**Settings → API** で:
- `SUPABASE_URL` をコピー
- `SUPABASE_ANON_KEY` をコピー

### Step 4: .env.local に設定

ファイル `.env.local` に追加:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ファイル構成

```
services/
  ├── supabase.ts          # Supabaseクライアント＆データベース操作
  └── foodAnalysis.ts      # AI食品分析サービス

app/(tabs)/
  ├── provider.tsx         # 食品提供者画面（撮影＆AI分析）
  └── consumer.tsx         # 子ども食堂画面（在庫確認）

constants/
  ├── supabase.ts          # 設定定数
  └── translations.ts      # 多言語対応
```

---

## 機能説明

### 提供者側フロー（provider.tsx）

1. **カメラで撮影** → 食品の写真を撮影
2. **AI 分析** → 食品の名前、種類、賞味期限を自動認識
3. **安全判定** → 🟢安全 または 🔴提供不可 を表示
4. **DB保存** → Supabase に完全データを保存

### 消費者側フロー（consumer.tsx）

1. **Supabase から取得** → 登録されている食品一覧を表示
2. **リアルタイム更新** → 新しい食品が追加されると自動更新
3. **詳細確認** → 食品名、場所、数量を一覧表示

---

## AI 食品認識について

### 現在の実装
- **モック AI**: テスト用の模擬結果を返す（実装例での動作確認用）
- **自動遅延**: 2秒の処理時間をシミュレート

### 次のステップ: 本格的な AI に移行

#### オプション 1: Google Cloud Vision API（推奨）

```typescript
// services/foodAnalysis.ts の analyzeFoodWithVisionAPI() を使用
const result = await analyzeFoodWithVisionAPI(
  imageBase64,
  'AIzaSy...' // Google Cloud API Key
);
```

**メリット:**
- 99%以上の高精度
- 賞味期限の自動読取
- 複雑な画像処理に対応

**料金:** 月 $0～50（初回1,000リクエスト無料）

#### オプション 2: TensorFlow.js + MobileNet

```typescript
// ローカル実行で完全無料
// プライバシー保護（画像をサーバーに送信しない）
```

---

## アプリ起動

### ローカル開発

```bash
# Expo 開始
npx expo start

# Web ブラウザ
w キーを押す → http://localhost:8081 でテスト

# Expo Go アプリ
QR コードをスキャン
```

---

## トラブルシューティング

### Supabase に接続できない

1. `.env.local` に正しい `SUPABASE_URL` と `SUPABASE_ANON_KEY` が設定されているか確認
2. Supabase ダッシュボードで API が有効になっているか確認
3. キーをコピー/ペーストした際に余分なスペースがないか確認

### 画像がアップロードされない

1. Supabase → Storage → `food_images` bucket が存在するか確認
2. Bucket のアクセス権限が「Public」に設定されているか確認

### AI 分析がエラーになる

- 現在はモック実装なので、ネットワーク接続は不要
- 本格的な API 連携時に適切なエラーハンドリングを追加

---

## 次のカスタマイズ例

### 1. ユーザー認証の追加
```typescript
// Supabase Auth を使用
const { data } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});
```

### 2. リアルタイム通知
```typescript
// 新しい食品が追加された時にリアルタイム通知
supabase
  .from('food_items')
  .on('*', payload => {
    console.log('New food item:', payload);
  })
  .subscribe();
```

### 3. 位置情報統合
```typescript
// ユーザーの現在地に基づいて、最寄りの food_items を表示
const nearbyFood = foodItems.filter(
  item => calculateDistance(userLocation, item.location) < 5 // 5km以内
);
```

---

## 完全無料で運用するには

✅ **Supabase**: 無制限 API 呼び出し（無料プラン）  
✅ **画像アップロード**: 最初の 5GB まで無料  
✅ **モック AI**: 完全に無料  
✅ **TensorFlow.js**: オプション（完全無料）  

⚠️ 本格的な AI API（Google Vision など）を使用する場合のみ月額 $50～$100 程度

---

## サポート

問題が発生した場合:
1. `.env.local` の設定を確認
2. Supabase ダッシュボードでテーブル＆アクセス権を確認
3. ブラウザのコンソール（F12キー）でエラーメッセージを確認
