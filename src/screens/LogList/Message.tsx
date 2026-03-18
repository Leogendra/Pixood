import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from './SectionHeader';
import { t } from '../../helpers/translation';
import { LogEntry } from '@/hooks/useLogs';
import useColors from '@/hooks/useColors';
import { Text, View } from 'react-native';




export const Message = ({
    item,
}: {
    item: LogEntry;
}) => {
    const navigation = useNavigation();
    const colors = useColors();

    return (
        <View
            style={{
            }}
        >
            <SectionHeader
                title={t('view_log_message')}
                onEdit={() => {
                    navigation.navigate('LogEdit', {
                        id: item.id,
                        step: 'message',
                    });
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                {item?.notes?.length > 0 ? (
                    <View
                        style={{
                            width: '100%',
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: colors.text,
                                    lineHeight: 23,
                                    width: '100%',
                                }}
                            >{item.notes}</Text>
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            paddingTop: 4,
                            paddingBottom: 8,
                            paddingHorizontal: 8,
                            width: '100%',
                        }}
                    >
                        <Text style={{
                            color: colors.textSecondary,
                            fontSize: 17,
                            lineHeight: 24,
                        }}>{t('view_log_message_empty')}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
