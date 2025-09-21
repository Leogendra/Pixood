import React, { useState } from 'react';
import { View, ScrollView, Platform, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackScreenProps } from '../../../types';
import useColors from '../../hooks/useColors';
import { useTagCategoriesState, useTagCategoriesUpdater } from '../../hooks/useTagCategories';
import { TagCategory, CategorizedTag } from '../../types/tagCategories';
import Button from '@/components/Button';
import LinkButton from '@/components/LinkButton';
import ModalHeader from '@/components/ModalHeader';
import { t } from '@/helpers/translation';
import { TagCategoryManagementModal } from './components/TagCategoryManagementModal';
import { TagManagementModal } from './components/TagManagementModal';

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
      <ModalHeader
        title={t('tag_categories_management')}
        right={
          <LinkButton
            onPress={() => navigation.goBack()}
            type='primary'
          >
            {t('done')}
          </LinkButton>
        }
      />

      {/* Bouton flottant pour créer une catégorie */}
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      >
        {tagState.categories.map((category: TagCategory) => {
          const categoryTags = getCategoryTags(category.id);
          
          return (
            <View key={category.id} style={{
              marginBottom: 24,
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}>
              {/* En-tête de catégorie */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: category.color,
                      marginRight: 12,
                    }}
                  />
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    flex: 1,
                  }}>
                    {category.name}
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => handleEditCategory(category)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: colors.background,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 12 }}>
                    {t('edit')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tags de la catégorie */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 12,
              }}>
                {categoryTags.map((tag: CategorizedTag) => (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => handleEditTag(tag)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: colors.background,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: colors.cardBorder,
                    }}
                  >
                    <Text style={{
                      color: colors.text,
                      fontSize: 14,
                    }}>
                      {tag.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bouton ajouter tag */}
              <TouchableOpacity
                onPress={() => handleCreateTag(category.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: colors.tint,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
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
          );
        })}

        <View style={{
          width: '100%',
          height: insets.bottom + 80,
        }} />
      </ScrollView>

      {/* Modales */}
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