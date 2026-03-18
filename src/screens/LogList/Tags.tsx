import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from './SectionHeader';
import { useTagCategoriesState } from '@/hooks/useTagCategories';
import { t } from '../../helpers/translation';
import { useTheme } from '@/hooks/useTheme';
import { LogEntry } from '@/hooks/useLogs';
import { Text, View } from 'react-native';
import useColors from '@/hooks/useColors';


const Tag = ({
    title,
    style = {},
}: {
    title: string;
    style?: any;
}) => {
    const colors = useColors();
    const theme = useTheme();

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 100,
                marginRight: 8,
                marginBottom: 8,
                backgroundColor: colors.tagBackground,
                borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 6,
                ...style,
            }}
        >
            <Text style={{
                color: colors.tagText,
                fontSize: 17,
            }}>{title}</Text>
        </View>
    )
};


export const Tags = ({
    item,
}: {
    item: LogEntry;
}) => {
    const colors = useColors();
    const { tags } = useTagCategoriesState();
    const navigation = useNavigation();

    return (
        <View
            style={{
            }}
        >
            <SectionHeader
                title={t('tags')}
                onEdit={() => {
                    navigation.navigate('LogEdit', {
                        id: item.id,
                        step: 'tags',
                    });
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {item && item.tags.length > 0 ? item.tags.map((tagId, index) => {
                    const tag = tags.find(t => t.id === tagId.tagId);

                    if (!tag) { return null; }

                    return (
                        <Tag
                            key={tagId.tagId}
                            title={tag.title}
                            style={{
                                backgroundColor: colors.entryBackground,
                                borderColor: colors.entryItemBorder,
                            }}
                        />
                    );
                }) : (
                    <View
                        style={{
                            paddingTop: 4,
                            paddingBottom: 8,
                            paddingHorizontal: 8,
                        }}
                    >
                        <Text style={{ color: colors.textSecondary, fontSize: 17 }}>{t('view_log_tags_empty')}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};