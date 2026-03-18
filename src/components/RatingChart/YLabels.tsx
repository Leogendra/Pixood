import { NUMBER_OF_RATINGS } from '@/constants/Config';
import useScale from '@/hooks/useScale';
import { Rect } from 'react-native-svg';




export const YLabels = ({
    relativeY, YLegendWidth, rowHeight, width
}) => {
    const { colors: scale } = useScale();

    return (
        <>
            {Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i).map((rating, index) => {
                const y = relativeY(index);
                return (
                    <Rect
                        key={`ylabel-${rating}-${index}`}
                        x={(YLegendWidth - 20) / 2}
                        y={y + rowHeight / 2 / 2}
                        width={20}
                        height={rowHeight / 2}
                        fill={scale[rating].background}
                        rx={4} />
                );
            })}
        </>
    );
};
