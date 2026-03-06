import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLanguage } from '@/hooks/use-language';
import { getAvailableFoodItems } from '@/services/supabase';
import { useFocusEffect } from '@react-navigation/native';

interface FoodItem {
  id: string;
  food_name: string;
  location: string;
  quantity: string;
}

const mockData: FoodItem[] = [
  { id: '1', food_name: '米', location: '市川駅ボックス', quantity: '5' },
  { id: '2', food_name: 'パスタ', location: '本八幡ボックス', quantity: '3' },
  { id: '3', food_name: '缶詰', location: '行徳ボックス', quantity: '10' },
  { id: '4', food_name: '野菜', location: '市川駅ボックス', quantity: '2' },
  { id: '5', food_name: '果物', location: '本八幡ボックス', quantity: '5' },
];

export default function ConsumerScreen() {
  const { t } = useLanguage();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 画面がフォーカスされる度に食品リストを更新
  useFocusEffect(
    React.useCallback(() => {
      loadFoodItems();
    }, [])
  );

  const loadFoodItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAvailableFoodItems();

      // API から取得したデータをフォーマット
      const formattedItems: FoodItem[] = (data || []).map((item: any) => ({
        id: item.id,
        food_name: item.food_name,
        location: item.location,
        quantity: String(item.quantity),
      }));

      // データがない場合はモックデータを使用
      if (formattedItems.length === 0) {
        setFoodItems(mockData);
      } else {
        setFoodItems(formattedItems);
      }
    } catch (err) {
      console.error('Failed to load food items:', err);
      setError('食品情報の読み込みに失敗しました');
      // エラー時もモックデータを表示
      setFoodItems(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.item}>
      <ThemedText style={styles.foodName}>{item.food_name}</ThemedText>
      <ThemedText style={styles.location}>{item.location}</ThemedText>
      <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
    </View>
  );

  if (isLoading && foodItems.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('consumer.title')}
      </ThemedText>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>{t('consumer.food')}</ThemedText>
        <ThemedText style={styles.headerText}>{t('consumer.location')}</ThemedText>
        <ThemedText style={styles.headerText}>{t('consumer.quantity')}</ThemedText>
      </View>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={loadFoodItems}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    flex: 1,
    textAlign: 'center',
  },
  location: {
    flex: 1,
    textAlign: 'center',
  },
  quantity: {
    flex: 1,
    textAlign: 'center',
  },
});