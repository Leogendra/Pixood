import { SafeAreaProvider } from "react-native-safe-area-context";
import { CalendarFiltersProvider } from "@/hooks/useCalendarFilters";
import { LogsProvider } from "@/hooks/useLogs";
import { SettingsProvider } from "@/hooks/useSettings";
import { StatisticsProvider } from "@/hooks/useStatistics";
import { TagsProvider } from "@/hooks/useTags";
import { TagCategoriesProvider } from "@/hooks/useTagCategories";
import { TemporaryLogProvider } from "@/hooks/useTemporaryLog";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        {/* <PasscodeProvider> */}
        <LogsProvider>
            <TagsProvider>
              <TagCategoriesProvider>
                <TemporaryLogProvider>
                  <CalendarFiltersProvider>
                    <StatisticsProvider>{children}</StatisticsProvider>
                  </CalendarFiltersProvider>
                </TemporaryLogProvider>
              </TagCategoriesProvider>
            </TagsProvider>
          </LogsProvider>
        {/* </PasscodeProvider> */}
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

export default Providers;
