import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/hooks/use-language';
import { LanguageCode } from '@/constants/translations';

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Language:</ThemedText>
      <View style={styles.buttonContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              language === lang.code && styles.activeButton,
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <ThemedText
              style={[
                styles.buttonText,
                language === lang.code && styles.activeButtonText,
              ]}
            >
              {lang.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 12,
  },
  activeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
