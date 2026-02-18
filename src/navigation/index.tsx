import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatisticsMonthScreen } from '../screens/StatisticsMonth';
import { StatisticsYearScreen } from '../screens/StatisticsYear';
import { DevelopmentTools } from '../screens/DevelopmentTools';
import { initializeDayjs, t } from '@/helpers/translation';
import { enableScreens } from 'react-native-screens';
import { Onboarding } from '../screens/Onboarding';
import { useSettings } from '@/hooks/useSettings';
import { RootStackParamList } from '../../types';
import { StepsScreen } from '../screens/Steps';
import { useTagsState } from '@/hooks/useTags';
import Providers from '@/components/Providers';
import { Platform, View } from 'react-native';
import { useLogState } from '@/hooks/useLogs';
import { useTheme } from '@/hooks/useTheme';
import useColors from '@/hooks/useColors';
import { BackButton } from './BackButton';
import { BottomTabs } from './BottomTabs';
import Colors from '@/constants/Colors';
import * as Linking from 'expo-linking';
import { Tags } from '../screens/Tags';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import {
    ColorsScreen,
    DataScreen,
    LogList,
    LogCreate,
    LogEdit,
    NotFoundScreen,
    ChangelogScreen,
    ReminderScreen,
    SettingsScreen,
    StatisticsHighlights,
    TagCreate,
    TagEdit,
    TagCategories,
    SettingsTags,
    SettingsTagsArchive
} from '../screens';

enableScreens();




const NAVIGATION_LINKING = {
    prefixes: [
        'pixood://',
        Linking.createURL('/'),
    ],
    config: {
        screens: {
            Calendar: 'calendar',
            Onboarding: 'onboarding',
            Settings: 'settings',
            Colors: 'settings/colors',
            Steps: 'settings/steps',
            Data: 'settings/data',
            Reminder: 'settings/reminder',
            Changelog: 'settings/changelog',
            DevelopmentTools: 'settings/development-tools',
            Statistics: 'statistics',
            StatisticsHighlights: 'statistics/highlights',
            StatisticsMonth: 'statistics/month/:date',
            StatisticsYear: 'statistics/year/:date',
            LogList: 'days/:date',
            LogCreate: 'logs/create/:dateTime',
            LogEdit: 'logs/:id/edit',
            Tags: 'tags',
            TagEdit: 'tags/:id',
            TagCreate: 'tags/create',
        },
    },
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function NavigationContent() {
    const theme = useTheme();

    return (
        <NavigationContainer
            linking={NAVIGATION_LINKING}
            // @ts-ignore
            theme={
                theme === 'dark'
                    ? { dark: true, colors: Colors.dark }
                    : { dark: false, colors: Colors.light }
            }
        >
            <RootNavigator />
        </NavigationContainer>
    );
}


export default function Navigation() {
    return (
        <Providers>
            <NavigationContent />
        </Providers>
    );
}


function RootNavigator() {
    const colors = useColors();
    const { settings, hasActionDone } = useSettings();
    const navigation = useNavigation();
    const logState = useLogState();
    const { tags } = useTagsState();

    const defaultOptions = {
        headerTintColor: colors.text,
        headerStyle: {
            backgroundColor: colors.background,
        },
        headerShadowVisible: Platform.OS !== 'web',
    };

    useEffect(() => {
        if (settings.loaded && !hasActionDone('onboarding')) {
            navigation.navigate('Onboarding');
        }

        initializeDayjs();
    }, [settings.loaded]);

    const defaultPageOptions = {
        headerLeft: () => (Platform.OS === 'ios' ? null : <BackButton testID={'settings-back-button'} />),
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <Stack.Navigator
                initialRouteName="tabs"
                screenOptions={{
                    navigationBarColor: colors.tabsBackground,
                }}
            >
                <Stack.Screen
                    name="tabs"
                    component={BottomTabs}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />

                <Stack.Group
                    screenOptions={{
                        title: '',
                        presentation: 'modal',
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="LogCreate" component={LogCreate} />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        title: '',
                        presentation: 'modal',
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="LogList" component={LogList} />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        title: '',
                        presentation: 'modal',
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="LogEdit" component={LogEdit} />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        title: '',
                        presentation: 'modal',
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        presentation: 'formSheet',
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Tags" component={Tags} />
                    <Stack.Screen name="TagCreate" component={TagCreate} />
                    <Stack.Screen name="TagEdit" component={TagEdit} />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        ...defaultOptions,
                        headerBackTitle: '',
                    }}
                >
                    <Stack.Screen
                        name="StatisticsHighlights"
                        component={StatisticsHighlights}
                        options={{
                            title: t('statistics_highlights'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="StatisticsYear"
                        component={StatisticsYearScreen}
                        options={{
                            title: dayjs().format('YYYY'),
                            headerShown: false,
                            ...defaultPageOptions,
                        }}
                    />
                </Stack.Group>
                <Stack.Group
                    screenOptions={{
                        ...defaultOptions,
                        headerBackTitle: '',
                    }}
                >
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            title: t('settings'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="StatisticsMonth"
                        component={StatisticsMonthScreen}
                        options={{
                            title: t('month_report'),
                            headerShown: false,
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="Reminder"
                        component={ReminderScreen}
                        options={{
                            title: t('reminder'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="Changelog"
                        component={ChangelogScreen}
                        options={{
                            title: t('changelog'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="Colors"
                        component={ColorsScreen}
                        options={{
                            title: t('settings_palette'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="SettingsTags"
                        component={SettingsTags}
                        options={{
                            title: t('tags'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="TagCategories"
                        component={TagCategories}
                        options={{
                            title: t('tag_categories_management'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="SettingsTagsArchive"
                        component={SettingsTagsArchive}
                        options={{
                            title: t('archive_tag'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="Steps"
                        component={StepsScreen}
                        options={{
                            title: t('steps'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="Data"
                        component={DataScreen}
                        options={{
                            title: t('data'),
                            ...defaultPageOptions,
                        }}
                    />
                    <Stack.Screen
                        name="DevelopmentTools"
                        component={DevelopmentTools}
                        options={{
                            title: t('settings_development_statistics'),
                            ...defaultPageOptions,
                        }}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </View>
    );
}
