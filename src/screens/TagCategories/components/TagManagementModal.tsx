import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useColors from '@/hooks/useColors';
import { useTagCategoriesUpdater } from '@/hooks/useTagCategories';
import { TagCategory, CategorizedTag } from '@/types/tagCategories';
import { TAG_COLOR_NAMES } from '@/constants/Config';
import Button from '@/components/Button';
import LinkButton from '@/components/LinkButton';
import ModalHeader from '@/components/ModalHeader';
import { t } from '@/helpers/translation';

interface TagManagementModalProps {
  visible: boolean;
  tag: CategorizedTag | null;
  category: TagCategory | null;
  isCreating: boolean;
  onClose: () => void;
}

export const TagManagementModal: React.FC<TagManagementModalProps> = ({
  visible,
  tag,
  category,
  isCreating,
  onClose,
}) => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tagUpdater = useTagCategoriesUpdater();

  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  useEffect(() => {
    if (tag && !isCreating) {
      setTitle(tag.title);
      setSelectedColor(tag.color);
    } else if (category) {
      setTitle('');
      setSelectedColor(category.color); // Utilise la couleur de la catégorie par défaut
    } else {
      setTitle('');
      setSelectedColor('blue');
    }
  }, [tag, category, isCreating, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('tag_title_required'));
      return;
    }

    if (!category) {
      Alert.alert(t('error'), t('category_required'));
      return;
    }

    if (isCreating) {
      tagUpdater.createTag(category.id, title.trim(), selectedColor);
    } else if (tag) {
      tagUpdater.updateTag(tag.id, {
        title: title.trim(),
        color: selectedColor,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!tag) return;

    Alert.alert(
      t('delete_tag_confirm_title'),
      t('delete_tag_confirm_message'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            tagUpdater.deleteTag(tag.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleArchive = () => {
    if (!tag) return;

    Alert.alert(
      t('archive_tag_confirm_title'),
      t('archive_tag_confirm_message'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('archive'),
          onPress: () => {
            tagUpdater.updateTag(tag.id, {
              isArchived: true,
            });
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
          title={isCreating ? t('create_tag') : t('edit_tag')}
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
          {/* Catégorie (affichage seulement) */}
          {category && (
            <View style={{ marginTop: 24, marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8,
              }}>
                {t('category')}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: category.color,
                    marginRight: 12,
                  }}
                />
                <Text style={{
                  fontSize: 16,
                  color: colors.text,
                }}>
                  {category.name}
                </Text>
              </View>
            </View>
          )}

          {/* Titre du tag */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 8,
            }}>
              {t('tag_title')}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('tag_title_placeholder')}
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
              maxLength={30}
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

          {/* Actions pour un tag existant */}
          {!isCreating && tag && (
            <View style={{ marginBottom: 24, gap: 12 }}>
              <Button
                type="secondary"
                onPress={handleArchive}
              >
                {t('archive_tag')}
              </Button>
              
              <Button
                type="danger"
                onPress={handleDelete}
              >
                {t('delete_tag')}
              </Button>
            </View>
          )}

          <View style={{ height: insets.bottom + 24 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};