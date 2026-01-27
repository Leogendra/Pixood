import { useSettings } from '../../../hooks/useSettings';
import TextHeadline from '@/components/TextHeadline';
import { t } from '@/helpers/translation';
import Scale from '@/components/Scale';
import { View } from 'react-native';




export const RatingSection = ({
    value,
    onChange,
    allowMultiple = false,
}: {
    value: number[];
    onChange: (value: number) => void;
    allowMultiple?: boolean;
}) => {
    const { settings } = useSettings();

    return (
        <View
            style={{
                marginBottom: 16,
            }}
        >
            <TextHeadline style={{ marginBottom: 12 }}>{t('mood')}</TextHeadline>
            <Scale
                value={value}
                onPress={onChange}
                allowMultiple={allowMultiple}
            />
        </View>
    );
};
