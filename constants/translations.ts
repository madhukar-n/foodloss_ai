export const translations = {
  en: {
    home: {
      title: 'Food Loss Reduction × AI × Children\'s Cafeteria',
      description:
        'A food sharing system that connects citizens\' refrigerators. We safely analyze surplus food with AI and provide it to children\'s cafeterias.',
    },
    provider: {
      title: 'Food Provider',
      permissionMessage: 'We need your permission to show the camera',
      grantPermission: 'Grant Permission',
      flipCamera: 'Flip Camera',
      capture: 'Capture',
      photoTaken: 'Photo taken',
      photoMessage: 'AI analysis will be implemented next',
      error: 'Error',
      errorMessage: 'Failed to take picture',
    },
    consumer: {
      title: 'Available Food',
      food: 'Food',
      location: 'Location',
      quantity: 'Quantity',
    },
    tabs: {
      home: 'Home',
      provider: 'Provider',
      consumer: 'Children\'s Cafeteria',
    },
  },
  ja: {
    home: {
      title: '食品ロス削減 × AI × 子ども食堂',
      description:
        '市民の冷蔵庫をつなぐ食品共有システム。家庭の余剰食品をAIで安全に分析し、子ども食堂へ提供します。',
    },
    provider: {
      title: '食品提供者',
      permissionMessage: 'カメラを使用するために許可が必要です',
      grantPermission: '許可を与える',
      flipCamera: 'カメラを切り替える',
      capture: '撮影',
      photoTaken: '写真を撮影しました',
      photoMessage: 'AI分析は次のステップで実装予定です',
      error: 'エラー',
      errorMessage: '写真の撮影に失敗しました',
    },
    consumer: {
      title: '利用可能な食品',
      food: '食品',
      location: '場所',
      quantity: '数量',
    },
    tabs: {
      home: 'ホーム',
      provider: '提供者',
      consumer: '子ども食堂',
    },
  },
};

export type LanguageCode = 'en' | 'ja';
