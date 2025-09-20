import dayjs from 'dayjs';
import { ScrollView, Text, View } from 'react-native';
import { CHANGELOG_ENTRIES } from '@/data/changelog';
import useColors from '@/hooks/useColors';
import { t } from '@/helpers/translation';

export const ChangelogScreen = () => {
  const colors = useColors();

  const entries = CHANGELOG_ENTRIES
    .slice()
    .sort((a, b) => dayjs(b.published).valueOf() - dayjs(a.published).valueOf());

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 16,
        }}
      >
        {t('changelog')}
      </Text>

      {entries.map(entry => (
        <View
          key={entry.slug}
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            backgroundColor: colors.cardBackground,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            {dayjs(entry.published).format('LL')}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 8,
            }}
          >
            {entry.title}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            {entry.summary}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};
