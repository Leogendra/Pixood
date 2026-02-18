import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SlideMoodButton } from "../components/SlideMoodButton";
import { SlideHeadline } from "../components/SlideHeadline";
import { CategoryTagSelector } from "./CategoryTagSelector";
import { getLogEditMarginTop } from "@/helpers/responsive";
import { useTemporaryLog } from "@/hooks/useTemporaryLog";
import { NUMBER_OF_RATINGS } from "@/constants/Config";
import { ScrollView, Text, View } from "react-native";
import { LogEntry } from "@/hooks/useLogs";
import { t } from "@/helpers/translation";
import useColors from "@/hooks/useColors";
import TextArea from "../../TextArea";




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
                    paddingBottom: insets.bottom + 50,
                }}
                showsVerticalScrollIndicator={false}
            >

                {/* Rating section */}
                <View style={{ marginBottom: 40 }}>
                    <SlideHeadline style={{ marginBottom: 8 }}>
                        {t('log_modal_mood_question')}
                    </SlideHeadline>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >

                        {RATING_VALUES.map((rating) => (
                            <SlideMoodButton
                                key={rating}
                                rating={rating}
                                selected={tempLog.data.rating?.includes(rating) || false}
                                onPress={() => {
                                    const currentRatings = tempLog.data.rating || [];
                                    if (currentRatings.includes(rating)) {
                                        onRatingChange(currentRatings.filter(r => r !== rating));
                                    }
                                    else {
                                        onRatingChange([...currentRatings, rating]);
                                    }
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* Tags section */}
                <View style={{ marginBottom: 40 }}>
                    <SlideHeadline style={{ marginBottom: 8 }}>
                        {t('log_modal_tags_question')}
                    </SlideHeadline>
                    <CategoryTagSelector
                        selectedTagIds={tempLog.data.selectedCategorizedTagIds || []}
                        onTagsChange={onTagsChange}
                        showDisable={showDisable}
                        onDisableStep={onDisableStep}
                    />
                </View>

                {/* Notes section */}
                <View style={{ marginBottom: 20 }}>
                    <SlideHeadline style={{ marginBottom: 8 }}>
                        {t('log_modal_note_question')}
                    </SlideHeadline>
                    <TextArea
                        value={tempLog.data.notes}
                        onChange={onMessageChange}
                        maxLength={99999}
                        style={{
                            minHeight: 100,
                            // height: fitContent

                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};