import { View } from 'react-native';
import Tag from '@/components/Tag';
import TextHeadline from '@/components/TextHeadline';
import { CategorizedTag as ITag } from '@/types/tagCategories';

export const TagsSection = ({
  tags, selectedTags, onSelect,
}: {
  tags: ITag[];
  selectedTags: ITag[];
  onSelect: (tag: ITag) => void;
}) => {
  return (
    <View>
      <TextHeadline style={{ marginBottom: 12 }}>Tags</TextHeadline>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {tags?.map((tag) => (
          <Tag
            selected={selectedTags.map(d => d.id).includes(tag.id)}
            onPress={() => onSelect(tag)}
            key={tag.id}
            colorName={'slate'}
            title={tag.title} />
        ))}
      </View>
    </View>
  );
};
