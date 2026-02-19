import { CategorizedTag, TagCategory } from '@/types/tagCategories';
import { useTagCategoriesState } from '@/hooks/useTagCategories';
import { View, Text, TouchableOpacity } from 'react-native';
import { t } from '@/helpers/translation';
import useColors from '@/hooks/useColors';
import React, { useState } from 'react';




interface CategoryTagSelectorProps {
    selectedTagIds: string[];
    onTagsChange: (tagIds: string[]) => void;
    showDisable?: boolean;
    onDisableStep?: () => void;
}


export const CategoryTagSelector: React.FC<CategoryTagSelectorProps> = ({
    selectedTagIds,
    onTagsChange,
    showDisable = false,
    onDisableStep = () => { },
}) => {
    const colors = useColors();
    const tagState = useTagCategoriesState();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };


    const toggleTag = (tagId: string) => {
        const newSelectedTags = selectedTagIds.includes(tagId)
            ? selectedTagIds.filter(id => id !== tagId)
            : [...selectedTagIds, tagId];

        onTagsChange(newSelectedTags);
    };


    const getCategoryTags = (categoryId: string): CategorizedTag[] => {
        return tagState.tags.filter(tag => tag.categoryId === categoryId && !tag.isArchived);
    };


    const getSelectedTagsCount = (categoryId: string): number => {
        const categoryTags = getCategoryTags(categoryId);
        return categoryTags.filter(tag => selectedTagIds.includes(tag.id)).length;
    };


    if (!tagState.loaded) {
        return (
            <View style={{
                padding: 20,
                alignItems: 'center',
                backgroundColor: colors.background,
                borderRadius: 12,
            }}>
                <Text style={{ color: colors.textSecondary }}>
                    {t('loading')}...
                </Text>
            </View>
        );
    }

    
    return (
        <View>
            {tagState.categories.map((category: TagCategory) => {
                const categoryTags = getCategoryTags(category.id);
                const isExpanded = expandedCategories.includes(category.id);
                const selectedCount = getSelectedTagsCount(category.id);

                if (categoryTags.length === 0) return null;

                return (
                    <View key={category.id} style={{ marginBottom: 16 }}>
                        {/* Category header */}
                        <TouchableOpacity
                            onPress={() => toggleCategory(category.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 16,
                                backgroundColor: colors.background,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: isExpanded ? colors.tint : colors.cardBorder,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: colors.text,
                                }}>
                                    {category.name}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {selectedCount > 0 && (
                                    <View style={{
                                        backgroundColor: colors.tint,
                                        borderRadius: 10,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        marginRight: 8,
                                    }}>
                                        <Text style={{
                                            color: colors.primaryButtonText,
                                            fontSize: 12,
                                            fontWeight: '600',
                                        }}>
                                            {selectedCount}
                                        </Text>
                                    </View>
                                )}

                                <Text style={{
                                    fontSize: 18,
                                    color: colors.textSecondary,
                                    transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                                }}>
                                    ›
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Tag categories */}
                        {isExpanded && (
                            <View style={{
                                marginTop: 8,
                                padding: 16,
                                backgroundColor: colors.cardBackground,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.cardBorder,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}>
                                    {categoryTags.map((tag: CategorizedTag) => {
                                        const isSelected = selectedTagIds.includes(tag.id);

                                        return (
                                            <TouchableOpacity
                                                key={tag.id}
                                                onPress={() => toggleTag(tag.id)}
                                                style={{
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 8,
                                                    borderRadius: 20,
                                                    backgroundColor: isSelected ? colors.tint : colors.background,
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? colors.tint : colors.cardBorder,
                                                }}
                                            >
                                                <Text style={{
                                                    color: isSelected ? colors.primaryButtonText : colors.text,
                                                    fontSize: 14,
                                                    fontWeight: isSelected ? '600' : '400',
                                                }}>
                                                    {tag.title}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {categoryTags.length === 0 && (
                                    <Text style={{
                                        color: colors.textSecondary,
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                    }}>
                                        {t('no_tags_in_category')}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
};