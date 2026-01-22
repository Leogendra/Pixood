import { LogEntry } from '@/hooks/useLogs';
import { dummyTagsDistributionData, getTagsDistributionData } from '@/hooks/useStatistics/TagsDistribution';
import { useTagsState } from '@/hooks/useTags';
import { TagDistributionContent } from '../../screens/Statistics/TagsDistributionCard';
import { BigCard } from '../BigCard';
import { NotEnoughDataOverlay } from './NotEnoughDataOverlay';

const MIN_TAGS = 5;

export const TagDistribution = ({
    title,
    subtitle,
    items,
}: {
    title: string
    subtitle: string
    items: LogEntry[],
}) => {
    const tagState = useTagsState();

    const data = getTagsDistributionData(items, tagState.tags);

    return (
        <BigCard
            title={title}
            subtitle={subtitle}
            isShareable
        >
            {data.tags.length < MIN_TAGS && (
                <NotEnoughDataOverlay />
            )}
            {data.tags.length >= MIN_TAGS ? (
                <TagDistributionContent
                    data={data}
                    limit={10}
                />
            ) : (
                <TagDistributionContent
                    data={dummyTagsDistributionData}
                    limit={10}
                />
            )}
        </BigCard>
    );
};
