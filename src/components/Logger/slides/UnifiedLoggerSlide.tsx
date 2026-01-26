import { getLogEditMarginTop } from "@/helpers/responsive";
import { t } from "@/helpers/translation";
import useColors from "@/hooks/useColors";
import { LogEntry } from "@/hooks/useLogs";
import { useTemporaryLog } from "@/hooks/useTemporaryLog";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideHeadline } from "../components/SlideHeadline";
import { SlideMoodButton } from "../components/SlideMoodButton";
import { CategoryTagSelector } from "./CategoryTagSelector";
import TextArea from "../../TextArea";
import { NUMBER_OF_RATINGS } from "@/constants/Config";

const RATING_VALUES = Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => i + 1);


export const UnifiedLoggerSlide = ({
    onRatingChange,
    onTagsChange,
    onMessageChange,
    showDisable,
    onDisableStep = () => { },
}: {
    onRatingChange: (rating: LogEntry['rating']) => void;
    onTagsChange: (tagIds: string[]) => void;
    onMessageChange: (notes: string) => void;
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
                        {RATING_VALUES.map((rating) => (
                            <SlideMoodButton
                                key={rating}
                                rating={rating}
                                selected={tempLog.data.rating?.includes(rating) || false}
                                onPress={() => {
                                    // Toggle rating in array
                                    const currentRatings = tempLog.data.rating || [];
                                    if (currentRatings.includes(rating)) {
                                        onRatingChange(currentRatings.filter(r => r !== rating));
                                    } else {
                                        onRatingChange([...currentRatings, rating]);
                                    }
                                }}
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
                        value={tempLog.data.notes}
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