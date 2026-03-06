import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useLanguage } from '@/hooks/use-language';
import { analyzeFood, uploadImage } from '@/services/foodAnalysis';
import { saveFoodItem, getCurrentUser } from '@/services/supabase';
import { supabase } from '@/services/supabase';

export default function ProviderScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { t } = useLanguage();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          {t('provider.permissionMessage')}
        </ThemedText>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>{t('provider.grantPermission')}</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isAnalyzing) {
      try {
        setIsAnalyzing(true);

        // 写真撮影
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        if (!photo.base64) {
          throw new Error('Failed to capture photo');
        }

        // AI で食品を分析
        Alert.alert('分析中', 'AIが食品を分析しています...');
        const analysisResult = await analyzeFood(photo.base64);

        // 現在のユーザーを取得
        const user = await getCurrentUser();
        if (!user) {
          Alert.alert(t('provider.error'), 'ユーザーがログインしていません');
          return;
        }

        // 画像をアップロード
        let imageUrl: string | undefined;
        try {
          imageUrl = await uploadImage(photo.uri, user.id, supabase);
        } catch (uploadError) {
          console.warn('Image upload failed:', uploadError);
          // 画像アップロード失敗時も続行
        }

        // データベースに保存
        await saveFoodItem(user.id, {
          food_name: analysisResult.food_name,
          food_type: analysisResult.food_type,
          expiry_date: analysisResult.expiry_date || undefined,
          package_condition: analysisResult.package_condition,
          food_quality: analysisResult.food_quality,
          safety_status: analysisResult.safety_status,
          location: 'My Home', // TODO: ユーザーの位置から自動入力
          image_url: imageUrl,
        });

        // 結果を表示
        const resultMessage =
          analysisResult.safety_status === 'safe'
            ? `✅ 安全（提供可能）\n\n食品: ${analysisResult.food_name}\n種類: ${analysisResult.food_type}\n賞味期限: ${analysisResult.expiry_date || '不明'}\n品質: ${analysisResult.food_quality}`
            : `🔴 提供不可\n\n安全性に問題があります\n食品: ${analysisResult.food_name}`;

        Alert.alert('分析結果', resultMessage);

        setIsAnalyzing(false);
      } catch (error) {
        setIsAnalyzing(false);
        Alert.alert(
          t('provider.error'),
          error instanceof Error ? error.message : '処理に失敗しました'
        );
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <ThemedView style={styles.container}>
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>分析中...</ThemedText>
        </View>
      )}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraFacing}
            disabled={isAnalyzing}
          >
            <Text style={styles.buttonText}>
              {t('provider.flipCamera')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isAnalyzing}
          >
            <Text style={styles.captureText}>📸</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 16,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  captureButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    padding: 20,
    marginHorizontal: 10,
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(200,200,200,0.3)',
  },
  captureText: {
    fontSize: 24,
  },
});