import { getLogEditMarginTop } from "@/helpers/responsive";
import { t } from "@/helpers/translation";
import useColors from "@/hooks/useColors";
import { LogItem, RATING_KEYS, SLEEP_QUALITY_KEYS } from "@/hooks/useLogs";
import { useTemporaryLog } from "@/hooks/useTemporaryLog";
import { Emotion, TagReference } from "@/types";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideHeadline } from "../components/SlideHeadline";
import { SlideMoodButton } from "../components/SlideMoodButton";
import { SlideEmotions } from "./SlideEmotions";
import { SlideTags } from "./SlideTags";
import { SlideSleepButton } from "./SlideSleepButton";
import TextArea from "../../TextArea";
import { useRef } from "react";

export const UnifiedLoggerSlide = ({
  onRatingChange,
  onEmotionsChange,
  onTagsChange,
  onSleepChange,
  onMessageChange,
  showDisable,
  onDisableStep = () => {},
}: {
  onRatingChange: (rating: LogItem['rating']) => void;
  onEmotionsChange: (emotions: Emotion[]) => void;
  onTagsChange: (tags: TagReference[]) => void;
  onSleepChange: (quality: LogItem['sleep']['quality']) => void;
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

        {/* Section Emotions */}
        <View style={{ marginBottom: 40 }}>
          <SlideHeadline style={{ marginBottom: 8 }}>
            {t('log_modal_emotions_question')}
          </SlideHeadline>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginBottom: 16,
          }}>
            {t('log_modal_emotions_description')}
          </Text>
          <SlideEmotions
            onChange={onEmotionsChange}
            showDisable={showDisable}
            onDisableStep={onDisableStep}
            showFooter={false}
          />
        </View>

        {/* Section Sleep Quality */}
        <View style={{ marginBottom: 40 }}>
          <SlideHeadline style={{ marginBottom: 8 }}>
            {t('log_sleep_question')}
          </SlideHeadline>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 16,
            marginBottom: 16,
          }}>
            {t('logger_step_sleep_description')}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}>
            {SLEEP_QUALITY_KEYS.slice().reverse().map((key) => (
              <SlideSleepButton
                key={key}
                value={key}
                selected={tempLog.data.sleep?.quality === key}
                onPress={() => onSleepChange(key)}
              />
            ))}
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: 'center',
              flex: 1,
            }}>
              {t('logger_step_sleep_low')}
            </Text>
            <Text style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: 'center',
              flex: 1,
            }}>
              {t('logger_step_sleep_high')}
            </Text>
          </View>
        </View>

        {/* Section Tags */}
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
          <SlideTags
            onChange={onTagsChange}
            showDisable={showDisable}
            onDisableStep={onDisableStep}
            showFooter={false}
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