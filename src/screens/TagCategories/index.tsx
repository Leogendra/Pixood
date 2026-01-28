import { useTagCategoriesState, useTagCategoriesUpdater } from '../../hooks/useTagCategories';
import { TagCategoryManagementModal } from './components/TagCategoryManagementModal';
import { View, ScrollView, Platform, Text, TouchableOpacity } from 'react-native';
import { TagCategory, CategorizedTag } from '../../types/tagCategories';
import { TagManagementModal } from './components/TagManagementModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTextColor } from '@/constants/Colors/PaletteUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackScreenProps } from '../../../types';
import ModalHeader from '@/components/ModalHeader';
import LinkButton from '@/components/LinkButton';
import useColors from '../../hooks/useColors';
import { Edit2 } from 'react-native-feather';
import { t } from '@/helpers/translation';
import Button from '@/components/Button';
import React, { useState } from 'react';




export const TagCategories = ({ navigation }: RootStackScreenProps<'TagCategories'>) => {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const tagState = useTagCategoriesState();
    const tagUpdater = useTagCategoriesUpdater();

    const [selectedCategory, setSelectedCategory] = useState<TagCategory | null>(null);
    const [selectedTag, setSelectedTag] = useState<CategorizedTag | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isCreatingTag, setIsCreatingTag] = useState(false);


    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setIsCreatingCategory(true);
        setShowCategoryModal(true);
    };


    const handleEditCategory = (category: TagCategory) => {
        setSelectedCategory(category);
        setIsCreatingCategory(false);
        setShowCategoryModal(true);
    };


    const handleCreateTag = (categoryId: string) => {
        const category = tagState.categories.find(c => c.id === categoryId);
        if (category) {
            setSelectedCategory(category);
            setSelectedTag(null);
            setIsCreatingTag(true);
            setShowTagModal(true);
        }
    };


    const handleEditTag = (tag: CategorizedTag) => {
        const category = tagState.categories.find(c => c.id === tag.categoryId);
        if (category) {
            setSelectedCategory(category);
            setSelectedTag(tag);
            setIsCreatingTag(false);
            setShowTagModal(true);
        }
    };


    const getCategoryTags = (categoryId: string): CategorizedTag[] => {
        return tagState.tags.filter(tag => tag.categoryId === categoryId && !tag.isArchived);
    };


    if (!tagState.loaded) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
            }}>
                <Text style={{ color: colors.textSecondary }}>
                    {t('loading')}...
                </Text>
            </View>
        );
    }


    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: colors.background,
            marginTop: Platform.OS === 'android' ? insets.top : 0,
        }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            >
                {tagState.categories.map((category: TagCategory) => {
                    const categoryTags = getCategoryTags(category.id);

                    return (
                        <View
                            key={category.id}
                            style={{
                                marginBottom: 24,
                                backgroundColor: colors.cardBackground,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.cardBorder,
                                overflow: 'hidden',
                            }}
                        >
                            {/* Category header */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                backgroundColor: colors.backgroundSecondary,
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: colors.text,
                                    flex: 1,
                                }}>
                                    {category.name}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => handleEditCategory(category)}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: colors.tint,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: colors.cardBorder,
                                    }}
                                >
                                    <Edit2
                                        width={16}
                                        height={16}
                                        stroke={colors.primaryButtonText}
                                        strokeWidth={3}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Category tags */}
                            <View style={{
                                padding: 16,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 10,
                                    marginBottom: 12,
                                }}>
                                    {categoryTags.map((tag: CategorizedTag) => (
                                        <TouchableOpacity
                                            key={tag.id}
                                            onPress={() => handleEditTag(tag)}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 6,
                                                paddingHorizontal: 14,
                                                paddingVertical: 5,
                                                backgroundColor: colors.backgroundTertiary,
                                                borderRadius: 15,
                                                borderWidth: 1,
                                            }}
                                        >
                                            <Edit2
                                                width={14}
                                                height={14}
                                                stroke={colors.text}
                                                strokeWidth={2.5}
                                            />
                                            <Text style={{
                                                color: colors.text,
                                                fontSize: 15,
                                                fontWeight: '600',
                                            }}>
                                                {tag.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Add tag button */}
                                <TouchableOpacity
                                    onPress={() => handleCreateTag(category.id)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        backgroundColor: colors.tint,
                                        borderRadius: 5,
                                        marginTop: 10,
                                        alignSelf: 'center',
                                    }}
                                >
                                    <Text style={{
                                        color: colors.primaryButtonText,
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}>
                                        + {t('add_tag')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                <View style={{
                    width: '100%',
                    height: insets.bottom + 80,
                }} />
            </ScrollView>

            {/* Floating button to create category */}
            <LinearGradient
                pointerEvents="none"
                colors={[colors.logBackgroundTransparent, colors.background, colors.background]}
                style={{
                    position: 'absolute',
                    height: 120 + insets.bottom,
                    bottom: 0,
                    zIndex: 1,
                    width: '100%',
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    position: 'absolute',
                    bottom: insets.bottom + 16,
                    width: '100%',
                    zIndex: 2,
                }}
            >
                <Button
                    style={{
                        marginTop: 16,
                        width: '100%',
                    }}
                    onPress={handleCreateCategory}
                >
                    {t('create_category')}
                </Button>
            </View>

            {/* Modals */}
            <TagCategoryManagementModal
                visible={showCategoryModal}
                category={selectedCategory}
                isCreating={isCreatingCategory}
                onClose={() => setShowCategoryModal(false)}
            />

            <TagManagementModal
                visible={showTagModal}
                tag={selectedTag}
                category={selectedCategory}
                isCreating={isCreatingTag}
                onClose={() => setShowTagModal(false)}
            />
        </View>
    );
};