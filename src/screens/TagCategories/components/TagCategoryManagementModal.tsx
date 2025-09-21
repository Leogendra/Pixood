import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useColors from '@/hooks/useColors';
import { useTagCategoriesUpdater } from '@/hooks/useTagCategories';
import { TagCategory } from '@/types/tagCategories';
import { TAG_COLOR_NAMES } from '@/constants/Config';
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

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  useEffect(() => {
    if (category && !isCreating) {
      setName(category.name);
      setSelectedColor(category.color);
    } else {
      setName('');
      setSelectedColor('blue');
    }
  }, [category, isCreating, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t('error'), t('category_name_required'));
      return;
    }

    if (isCreating) {
      tagUpdater.createCategory(name.trim(), selectedColor);
    } else if (category) {
      tagUpdater.updateCategory(category.id, {
        name: name.trim(),
        color: selectedColor,
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
          {/* Nom de la catégorie */}
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

          {/* Sélection de couleur */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 16,
            }}>
              {t('color')}
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              {TAG_COLOR_NAMES.map((colorName) => (
                <TouchableOpacity
                  key={colorName}
                  onPress={() => setSelectedColor(colorName)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.tags[colorName].dot,
                    borderWidth: selectedColor === colorName ? 3 : 1,
                    borderColor: selectedColor === colorName ? colors.tint : colors.cardBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedColor === colorName && (
                    <Text style={{
                      color: colors.tags[colorName].text,
                      fontSize: 18,
                    }}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bouton de suppression (uniquement en mode édition et si ce n'est pas une catégorie par défaut) */}
          {!isCreating && category && !category.isDefault && (
            <View style={{ marginBottom: 24 }}>
              <Button
                type="danger"
                onPress={handleDelete}
              >
                {t('delete_category')}
              </Button>
            </View>
          )}

          <View style={{ height: insets.bottom + 24 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};