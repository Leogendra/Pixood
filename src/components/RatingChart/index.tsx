import Svg, { Line, Polyline } from 'react-native-svg';
import useColors from '@/hooks/useColors';
import { NUMBER_OF_RATINGS } from '@/constants/Config';
import { Grid } from './Grid';
import { XLabels } from './XLabels';
import { YLabels } from './YLabels';

export interface ScaleItem {
    key: string;
    count: number;
    value: number | null;
}

export const RatingChart = ({
    data,
    height,
    width,
    showAverage = false,
}: {
    height: number;
    width: number;
    data: ScaleItem[];
    showAverage?: boolean;
}) => {
    const colors = useColors();

    const paddingRight = 8;
    const paddingLeft = 8;
    const maxY = 6;

    const scaleItemCount = data.length;
    const scaleItems = data.map(d => ({
        ...d,
        value: d.value !== null ? Math.round(d.value) : null,
    }));

    const XLegendHeight = 32;
    const YLegendWidth = 32;

    const _height = Math.round(height / NUMBER_OF_RATINGS) * NUMBER_OF_RATINGS;
    const _width = width - YLegendWidth - paddingRight - paddingLeft;

    const rowHeight = Math.round(height / NUMBER_OF_RATINGS);
    const outerHeight = _height + XLegendHeight + rowHeight * 1;
    const outerWidth = width;

    const itemWidth = _width / (scaleItemCount);

    const relativeY = (value: number) => {
        return Math.floor(((_height) - (value / maxY) * (_height)))
    };

    const relativeX = (index: number) => {
        return Math.floor(index * itemWidth + itemWidth / 2) + YLegendWidth + paddingLeft;
    };

    const polygonPoints = scaleItems.map((item, index) => {
        if (item.value === null) {
            return null;
        }

        const x = Math.round(relativeX(index));
        const y = Math.round(relativeY(item.value || 0)) + rowHeight / 2;

        return `${x},${y}`;
    }).filter(Boolean).join(' ');

    const nonNullItems = scaleItems.filter(item => item.value !== null);
    const average = nonNullItems.reduce((acc, item) => {
        if (item.value === null) {
            return acc;
        }

        return acc + item.value;
    }, 0) / nonNullItems.length;

    return (
        <Svg
            width={'100%'}
            height={outerHeight}
            viewBox={`0 0 ${outerWidth} ${outerHeight}`}
            style={{}}
        >
            <YLabels
                relativeY={relativeY}
                YLegendWidth={YLegendWidth}
                rowHeight={rowHeight}
                width={outerWidth}
            />

            <XLabels
                items={scaleItems}
                x={index => relativeX(index)}
                y={outerHeight - XLegendHeight / 2}
            />

            <Grid
                width={width}
                relativeY={relativeY}
            />

            <Polyline
                fill="none"
                stroke={colors.statisticsLinePrimary}
                strokeWidth="2"
                strokeLinejoin='round'
                points={polygonPoints}
            />

            {/* {scaleItems.map((item, index) => {
        if (item.value === null) return;

        const x = relativeX(index);
        const y = relativeY(item.value);

        return (
          <Circle
            id={`c-${item.key}`}
            key={`d-${item.key}`}
            cx={x}
            cy={y + rowHeight / 2}
            r="3"
            strokeWidth={2}
            stroke={colors.statisticsLinePrimary}
            fill={colors.cardBackground}
          />
        );
      })} */}

            {showAverage && (
                <Line
                    key={`avg-line`}
                    x1={relativeX(0)}
                    y1={relativeY(average)}
                    x2={width - paddingRight}
                    y2={relativeY(average)}
                    stroke={colors.tint}
                    strokeWidth={2}
                />
            )}
        </Svg>
    );
};
