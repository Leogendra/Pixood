// Removed AsyncStorage import
import { act, renderHook } from "@testing-library/react-hooks";
// Removed: import { PostHogProvider } from "posthog-react-native";
import { AnalyticsProvider, useAnalytics } from "../hooks/useAnalytics";
import {
  INITIAL_STATE,
  SettingsProvider,
  STORAGE_KEY,
  useSettings
} from "../hooks/useSettings";

const wrapper = ({ children }) => (
  <SettingsProvider>
    <AnalyticsProvider
      options={{
        enabled: true,
      }}
    >{children}</AnalyticsProvider>
  </SettingsProvider>
);

const _renderHook = () => {
  return renderHook(
    () => ({
      state: useAnalytics(),
      settingsState: useSettings(),
    }),
    { wrapper }
  );
};

const _console_error = console.error;
const STATIC_DEVICE_ID = "test-device-id";

describe("useAnalytics()", () => {
  beforeEach(async () => {
    jest.restoreAllMocks();
    await AsyncStorage.clear();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = _console_error;
  });

  test("should `isEnabled` = true initially", async () => {
    const { result } = _renderHook();

    expect(result.current.settingsState.settings.analyticsEnabled).toBe(true);
    expect(result.current.state.isEnabled).toBe(true);
  });

  test("should `isEnabled` = false if disabled in settings", async () => {
    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(async () => {
      hook.result.current.settingsState.setSettings({
        ...hook.result.current.settingsState.settings,
        analyticsEnabled: false,
      });
    });

    expect(hook.result.current.state.isEnabled).toBe(false);
  });

  test("should `identify`", async () => {

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...INITIAL_STATE,
        deviceId: STATIC_DEVICE_ID,
      })
    );

    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(() => {
      hook.result.current.state.identify();
    });

    expect(hook.result.current.state.isIdentified).toBe(true);
  });

  test("should `enable`", async () => {
    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(() => {
      hook.result.current.state.enable();
    });

    expect(hook.result.current.state.isEnabled).toBe(true);
    expect(hook.result.current.settingsState.settings.analyticsEnabled).toBe(true)
  })

  test("should `disable`", async () => {
    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(() => {
      hook.result.current.state.disable();
    });

    expect(hook.result.current.state.isEnabled).toBe(false);
    expect(hook.result.current.settingsState.settings.analyticsEnabled).toBe(false)
  })

  test("should `track` with properties", async () => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...INITIAL_STATE,
        deviceId: STATIC_DEVICE_ID,
      })
    );

    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(() => {
      hook.result.current.state.track('test-event', { test: true });
    });

    expect(hook.result.current.state.isEnabled).toBe(true);
    expect(hook.result.current.settingsState.settings.analyticsEnabled).toBe(true)
  })

  test("should `reset`", async () => {
    const hook = _renderHook();
    await hook.waitForNextUpdate();

    await act(() => {
      hook.result.current.state.reset();
    });

    expect(hook.result.current.state.isEnabled).toBe(true);
    expect(hook.result.current.settingsState.settings.analyticsEnabled).toBe(true)
  })
});
