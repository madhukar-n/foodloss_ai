import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function HomeScreen() {
  const { t } = useLanguage();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
        />
      }>
      <LanguageSwitcher />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('home.title')}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText>
          {t('home.description')}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  descriptionContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  logo: {
    height: 178,
    width: 178,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
