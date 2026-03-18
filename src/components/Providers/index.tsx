import { CalendarFiltersProvider } from "@/hooks/useCalendarFilters";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TagCategoriesProvider } from "@/hooks/useTagCategories";
import { TemporaryLogProvider } from "@/hooks/useTemporaryLog";
import { StatisticsProvider } from "@/hooks/useStatistics";
import { SettingsProvider } from "@/hooks/useSettings";
import { LogsProvider } from "@/hooks/useLogs";




const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaProvider>
            <SettingsProvider>
                <LogsProvider>
                    <TagCategoriesProvider>
                        <TemporaryLogProvider>
                            <CalendarFiltersProvider>
                                <StatisticsProvider>{children}</StatisticsProvider>
                            </CalendarFiltersProvider>
                        </TemporaryLogProvider>
                    </TagCategoriesProvider>
                </LogsProvider>
            </SettingsProvider>
        </SafeAreaProvider>
    );
};


export default Providers;