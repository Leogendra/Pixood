import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useColors from '@/hooks/useColors';
import { useTagCategoriesState, useTagCategoriesUpdater } from '@/hooks/useTagCategories';
import { DEFAULT_TAGS } from '@/constants/Config';
import { TagCategory } from '@/types/tagCategories';
import Button from '@/components/Button';
import LinkButton from '@/components/LinkButton';
import ModalHeader from '@/components/ModalHeader';
import { t } from '@/helpers/translation';

interface TagCategoryManagementModalProps {
    visible: boolean;
    category: TagCategory | null;
    isCreating: boolean;
    onClose: () => void;
}

export const TagCategoryManagementModal: React.FC<TagCategoryManagementModalProps> = ({
    visible,
    category,
    isCreating,
    onClose,
}) => {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const tagUpdater = useTagCategoriesUpdater();
    const tagState = useTagCategoriesState();

    const [name, setName] = useState('');

    const handleAddPresetTags = async (categoryKey: string) => {
        const presetName = t(`tag_category_${categoryKey}`);
        
        // Check if category with this name already exists
        const existingCategory = tagState.categories.find(
            cat => cat.name.toLowerCase() === presetName.toLowerCase()
        );

        if (existingCategory) {
            Alert.alert(
                t('category_already_exists'),
                t('category_already_exists_message'),
                [
                    {
                        text: t('back'),
                        style: 'cancel',
                    },
                    {
                        text: t('continue'),
                        style: 'default',
                        onPress: async () => {
                            await createPresetCategoryAndTags(categoryKey, presetName, existingCategory.id);
                        },
                    },
                ]
            );
        } 
        else {
            await createPresetCategoryAndTags(categoryKey, presetName);
        }
    };

    const createPresetCategoryAndTags = async (categoryKey: string, presetName: string, existingCategoryId?: string) => {
        // Create the category if it doesn't exist yet
        const categoryId = existingCategoryId
            ? existingCategoryId
            : (await tagUpdater.createCategory(presetName)).id;

        // Add preset tags to the new category
        const defaultTagsForCategory = DEFAULT_TAGS[categoryKey as keyof typeof DEFAULT_TAGS];
        if (defaultTagsForCategory && Array.isArray(defaultTagsForCategory)) {
            const existingTitles = new Set(
                tagState.tags
                    .filter(tag => tag.categoryId === categoryId)
                    .map(tag => tag.title.trim().toLowerCase())
            );

            for (const tagTitle of defaultTagsForCategory) {
                const normalizedTitle = tagTitle.trim().toLowerCase();
                if (existingTitles.has(normalizedTitle)) {
                    continue;
                }

                await tagUpdater.createTag(categoryId, t(`tag_name_${tagTitle}`));
                existingTitles.add(normalizedTitle);
            }
        }

        onClose();
    };


    useEffect(() => {
        if (category && !isCreating) {
            setName(category.name);
        } 
        else {
            setName('');
        }
    }, [category, isCreating, visible]);


    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert(t('error'), t('category_name_required'));
            return;
        }

        if (isCreating) {
            tagUpdater.createCategory(name.trim());
        } else if (category) {
            tagUpdater.updateCategory(category.id, {
                name: name.trim(),
            });
        }

        onClose();
    };


    const handleDelete = () => {
        if (!category) return;

        Alert.alert(
            t('delete_category_confirm_title'),
            t('delete_category_confirm_message'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: () => {
                        tagUpdater.deleteCategory(category.id);
                        onClose();
                    },
                },
            ]
        );
    };


    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top,
            }}>
                <ModalHeader
                    title={isCreating ? t('create_category') : t('edit_category')}
                    left={
                        <LinkButton onPress={onClose}>
                            {t('cancel')}
                        </LinkButton>
                    }
                    right={
                        <LinkButton onPress={handleSave} type="primary">
                            {t('save')}
                        </LinkButton>
                    }
                />

                <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                    {/* Category name */}
                    <View style={{ marginTop: 24, marginBottom: 24 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: colors.text,
                            marginBottom: 8,
                        }}>
                            {t('category_name')}
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder={t('category_name_placeholder')}
                            placeholderTextColor={colors.textSecondary}
                            style={{
                                backgroundColor: colors.cardBackground,
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                color: colors.text,
                                borderWidth: 1,
                                borderColor: colors.cardBorder,
                            }}
                            maxLength={50}
                        />
                    </View>


                    {/* Delete button */}
                    {!isCreating && category && (
                        <View style={{ marginBottom: 24 }}>
                            <Button
                                type="danger"
                                onPress={handleDelete}
                            >
                                {t('delete_category')}
                            </Button>
                        </View>
                    )}


                    {/* Want inspiration section */}
                    {isCreating && (
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: colors.text,
                                marginBottom: 12,
                            }}>
                                💡 {t('want_inspiration')}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                                marginBottom: 12,
                            }}>
                                {t('add_preset_tags_description')}
                            </Text>

                            {Object.keys(DEFAULT_TAGS).map((categoryKey) => {
                                const tagList = DEFAULT_TAGS[categoryKey as keyof typeof DEFAULT_TAGS];
                                if (tagList.length === 0) { return null; }

                                return (
                                    <View
                                        key={categoryKey}
                                        style={{
                                            backgroundColor: colors.cardBackground,
                                            borderRadius: 12,
                                            padding: 12,
                                            marginBottom: 10,
                                            borderWidth: 1,
                                            borderColor: colors.cardBorder,
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 10,
                                        }}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: colors.text,
                                                flex: 1,
                                            }}>
                                                {t(`tag_category_${categoryKey}`)}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => handleAddPresetTags(categoryKey)}
                                                style={{
                                                    backgroundColor: colors.tint,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 6,
                                                }}
                                            >
                                                <Text style={{
                                                    color: colors.primaryButtonText,
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                }}>
                                                    + {t('add')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                        }}>
                                            {tagList.map((tag, idx) => (
                                                <View
                                                    key={idx}
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 4,
                                                        backgroundColor: colors.backgroundSecondary,
                                                        borderRadius: 12,
                                                        borderWidth: 1,
                                                        borderColor: colors.cardBorder,
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: colors.text,
                                                        fontWeight: '500',
                                                    }}>
                                                        {t(`tag_name_${tag}`)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <View style={{ height: insets.bottom + 24 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};