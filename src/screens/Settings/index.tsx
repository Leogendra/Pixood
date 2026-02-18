import { Bell, BookOpen, CheckCircle, Database, Droplet, Github, PieChart, Smartphone } from 'react-native-feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuListHeadline from '@/components/MenuListHeadline';
import { RootStackScreenProps } from '../../../types';
import { ScrollView, Text, View } from 'react-native';
import MenuListItem from '@/components/MenuListItem';
import { UserDataImportList } from './UserData';
import useColors from '../../hooks/useColors';
import MenuList from '@/components/MenuList';
import { t } from '@/helpers/translation';
import { Tag } from 'lucide-react-native';
import pkg from '../../../package.json';
import * as Linking from 'expo-linking';




export const SettingsScreen = ({ navigation }: RootStackScreenProps<'Settings'>) => {
    const insets = useSafeAreaInsets();
    const colors = useColors()

    const openGithubRepository = () => {
        Linking.openURL('https://github.com/Leogendra/Pixood')
    }

    return (
        <View style={{
            paddingTop: insets.top,
            flex: 1,
            backgroundColor: colors.background,
        }}>
            <ScrollView style={{ padding: 20 }} >
                <Text
                    style={{
                        fontSize: 32,
                        color: colors.text,
                        fontWeight: 'bold',
                        marginTop: 32,
                        marginBottom: 18,
                    }}
                >{t('settings')}</Text>
                <MenuList>
                    <MenuListItem
                        title={t('reminder')}
                        iconLeft={<Bell width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('Reminder')}
                        testID='reminder'
                        isLink
                    />
                    <MenuListItem
                        title={t('settings_palette')}
                        iconLeft={<Droplet width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('Colors')}
                        isLink
                    />
                    <MenuListItem
                        title={t('tag_categories_management')}
                        iconLeft={<Tag width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('TagCategories')}
                        isLink
                    />
                    <MenuListItem
                        title={t('steps')}
                        iconLeft={<CheckCircle width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('Steps')}
                        isLink
                    />
                    <MenuListItem
                        title={t('data')}
                        iconLeft={<Database width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('Data')}
                        testID='data'
                        isLink
                        isLast
                    />
                </MenuList>

                <MenuListHeadline>{t('settings_about')}</MenuListHeadline>
                <MenuList>
                    <MenuListItem
                        title={t('changelog')}
                        onPress={() => {
                            navigation.navigate('Changelog')
                        }}
                        iconLeft={<BookOpen width={18} color={colors.menuListItemIcon} />}
                        testID='changelog'
                        isLink
                    />
                    <MenuListItem
                        title={t('visit_github_repository')}
                        onPress={() => openGithubRepository()}
                        iconLeft={<Github width={18} color={colors.menuListItemIcon} />}
                        isLast
                    />
                </MenuList>

                <MenuListHeadline>{t('settings_development')}</MenuListHeadline>
                <MenuList>
                    <MenuListItem
                        title={`${t('settings_onboarding')}`}
                        iconLeft={<Smartphone width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('Onboarding')}
                    />
                    <MenuListItem
                        title={`${t('settings_development_statistics')}`}
                        iconLeft={<PieChart width={18} color={colors.menuListItemIcon} />}
                        onPress={() => navigation.navigate('DevelopmentTools')}
                        isLink
                        isLast
                    />
                </MenuList>
                <View
                    style={{
                        marginTop: 20,
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginBottom: 40,
                    }}
                >
                    <Text style={{ fontSize: 14, marginTop: 5, color: colors.textSecondary }}>Pixood v{pkg.version}</Text>
                </View>

                {__DEV__ && <UserDataImportList />}
            </ScrollView>
        </View>
    );
}
