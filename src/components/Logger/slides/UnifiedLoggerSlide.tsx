import { getLogEditMarginTop } from "@/helpers/responsive";
import { t } from "@/helpers/translation";
import useColors from "@/hooks/useColors";
import { LogItem, RATING_KEYS } from "@/hooks/useLogs";
import { useTemporaryLog } from "@/hooks/useTemporaryLog";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideHeadline } from "../components/SlideHeadline";
import { SlideMoodButton } from "../components/SlideMoodButton";
import { CategoryTagSelector } from "./CategoryTagSelector";
import TextArea from "../../TextArea";
import { useRef } from "react";

export const UnifiedLoggerSlide = ({
  onRatingChange,
  onTagsChange,
  onMessageChange,
  showDisable,
  onDisableStep = () => {},
}: {
  onRatingChange: (rating: LogItem['rating']) => void;
  onTagsChange: (tagIds: string[]) => void;
  onMessageChange: (message: string) => void;
  showDisable: boolean;
  onDisableStep?: () => void;
}) => {
  const colors = useColors();
  const tempLog = useTemporaryLog();
  const insets = useSafeAreaInsets();
  const marginTop = getLogEditMarginTop();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.logBackground,
      width: '100%',
    }}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{
          paddingTop: marginTop,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Mood Rating */}
        <View style={{ marginBottom: 40 }}>
          <SlideHeadline style={{ marginBottom: 8 }}>
            {t('log_modal_mood_question')}
          </SlideHeadline>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginBottom: 24,
          }}>
            {t('log_modal_mood_description')}
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}>
            {RATING_KEYS.map((rating) => (
              <SlideMoodButton
                key={rating}
                rating={rating}
                selected={tempLog.data.rating === rating}
                onPress={() => onRatingChange(rating)}
              />
            ))}
          </View>
        </View>

        {/* Section Tags par Catégories */}
        <View style={{ marginBottom: 40 }}>
          <SlideHeadline style={{ marginBottom: 8 }}>
            {t('log_modal_tags_question')}
          </SlideHeadline>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginBottom: 16,
          }}>
            {t('log_modal_tags_description')}
          </Text>
          <CategoryTagSelector
            selectedTagIds={tempLog.data.selectedCategorizedTagIds || []}
            onTagsChange={onTagsChange}
            showDisable={showDisable}
            onDisableStep={onDisableStep}
          />
        </View>

        {/* Section Message/Notes */}
        <View style={{ marginBottom: 20 }}>
          <SlideHeadline style={{ marginBottom: 8 }}>
            {t('log_modal_message_question')}
          </SlideHeadline>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginBottom: 16,
          }}>
            {t('log_modal_message_description')}
          </Text>
          <TextArea
            value={tempLog.data.message}
            onChange={onMessageChange}
            maxLength={10000}
            style={{
              minHeight: 100,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};