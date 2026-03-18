import { Line } from 'react-native-svg';
import useColors from '@/hooks/useColors';
import { NUMBER_OF_RATINGS } from '@/constants/Config';

export const Grid = ({
    width, relativeY,
}) => {
    const colors = useColors();

    return (
        <>
            {Array.from({ length: NUMBER_OF_RATINGS - 1 }).map((_, index) => {
                const y = relativeY(index);
                return (
                    <Line
                        key={`l-${index}`}
                        x1={0}
                        y1={y - 1}
                        x2={width}
                        y2={y}
                        stroke={colors.statisticsGridLine}
                        strokeWidth={1}
                        strokeDasharray={[4, 4]}
                    />
                );
            })}
        </>
    )
};
