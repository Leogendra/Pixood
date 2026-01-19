import { OFFLINE_STATISTICS_FEEDBACK_STORAGE_KEY } from '@/constants/API';
import { locale, t } from '@/helpers/translation';
import useColors from '@/hooks/useColors';
import useHaptics from '@/hooks/useHaptics';
import { useSettings } from '@/hooks/useSettings';
import * as StoreReview from 'expo-store-review';
import { useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, Text, View, ViewStyle } from 'react-native';
import pkg from '../../../package.json';
import Button from '../Button';
import TextArea from '../TextArea';
import { appendOfflineEntry } from '@/lib/offlineQueue';

const EMOJI_SCALE_IMAGES_DEFAULT = [{
  emoji: '😍',
  active: require(`../../../assets/images/emojis/smiling-face-with-heart-eyes_1f60d.png`),
  disabled: require(`../../../assets/images/emojis/smiling-face-with-heart-eyes_1f60d-disabled.png`)
}, {
  emoji: '🎉',
  active: require(`../../../assets/images/emojis/party-popper.png`),
  disabled: require(`../../../assets/images/emojis/party-popper-disabled.png`)
}, {
  emoji: '😴',
  active: require(`../../../assets/images/emojis/sleeping-face_1f634.png`),
  disabled: require(`../../../assets/images/emojis/sleeping-face_1f634-disabled.png`)
}, {
  emoji: '👎',
  active: require(`../../../assets/images/emojis/thumbs-down_1f44e.png`),
  disabled: require(`../../../assets/images/emojis/thumbs-down_1f44e-disabled.png`)
}]

const EMOJI_SCALE_IMAGES_MINIMAL = [{
  emoji: '👍',
  active: require(`../../../assets/images/emojis/thumbs-up_1f44d.png`),
  disabled: require(`../../../assets/images/emojis/thumbs-up_1f44d-disabled.png`)
}, {
  emoji: '👎',
  active: require(`../../../assets/images/emojis/thumbs-down_1f44e.png`),
  disabled: require(`../../../assets/images/emojis/thumbs-down_1f44e-disabled.png`)
}]

const CardFeedbackEmoji = ({ image, onPress, selected }) => {
  const haptics = useHaptics()
  const colors = useColors()

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 8,
        backgroundColor: colors.statisticsFeedbackEmojiBackground,
      }}
      onPress={async () => {
        await haptics.selection()
        onPress?.()
      }}
    >
      <Image style={{
        opacity: selected ? 1 : colors.statisticsFeedbackEmojiOpacity,
        width: 20,
        height: 20,
      }} source={image} />
    </Pressable>
  )
}
export const CardFeedback = ({
  analyticsId,
  analyticsData = {},
  variant = 'default',
  style = {},
}: {
  analyticsId: string,
  analyticsData?: any;
  variant?: 'default' | 'minimal',
  style?: ViewStyle,
}) => {
  const colors = useColors();
  const { settings } = useSettings()

  const [feedbackSent, setFeedbackSent] = useState(false);
  const [emojiSelected, setEmojiSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const onSendDone = () => {
    setLoading(false);
    setShowTextInput(false)
    setFeedbackSent(true)
    setEmojiSelected(null)

    setTimeout(() => {
      setFeedbackSent(false)
    }, 5000)
  }

  const send = async (emoji) => {
    setLoading(true);

    const metaData = {
      date: new Date().toISOString(),
      locale: locale,
      version: pkg.version,
      os: Platform.OS,
      deviceId: __DEV__ ? '__DEV__' : settings.deviceId,
    }

    const body = {
      type: analyticsId,
      emoji,
      comment,
      details: analyticsData,
      ...metaData,
    }

    console.log('Sending statistics feedback', body);


    return appendOfflineEntry(OFFLINE_STATISTICS_FEEDBACK_STORAGE_KEY, body)
      .finally(() => onSendDone())
  }

  const handleFeedback = async (emoji) => {
    if (loading) return;

    setEmojiSelected(emoji);

    if (emoji === emojiSelected) {
      setEmojiSelected(null)
      setShowTextInput(false)
      return;
    }

    if (['👎', '😴'].includes(emoji)) {
      setShowTextInput(true);
    } else {
      send(emoji);
      if (await StoreReview.hasAction() && variant === 'default') {
        StoreReview.requestReview().then(() => {
        }).catch(() => {
        })
      }
    }
  };

  const options = variant === 'default' ? EMOJI_SCALE_IMAGES_DEFAULT : EMOJI_SCALE_IMAGES_MINIMAL;

  return (
    <View
      style={{
        flexDirection: 'column',
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        marginLeft: -16,
        marginRight: -16,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: -8,
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!loading && (
          <>
            <Text
              style={{
                fontSize: 14,
                color: colors.statisticsFeedbackText,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {!feedbackSent ? t('statistics_feedback_question') : `🫶 ${t('statistics_feedback_thanks')}`}
            </Text>
          </>
        )}
        {loading && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <ActivityIndicator size={'small'} color={colors.loadingIndicator} />
          </View>
        )}
        {!feedbackSent && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {options.map((emojiScale, index) => (
              <View
                key={`emoji-feedback-${emojiScale.emoji}`}
                style={{
                  marginRight: index === options.length - 1 ? 0 : 8,
                }}
              >
                <CardFeedbackEmoji
                  selected={emojiSelected === emojiScale.emoji}
                  image={emojiSelected === emojiScale.emoji ? emojiScale.active : emojiScale.disabled}
                  onPress={() => handleFeedback(emojiScale.emoji)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
      {showTextInput && !loading && (
        <View
          style={{
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          <TextArea
            placeholder={t('statistics_feedback_placeholder')}
            value={comment}
            onChange={setComment}
            style={{
              paddingTop: 12,
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.textInputBorder || undefined,
              height: 24 * 2,
            }}
          />
          <Button
            onPress={() => send(emojiSelected)}
            style={{
              marginTop: 8,
            }}
          >{t('send')}</Button>
        </View>
      )}
    </View>
  );
};
