import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCachedResources from '@/hooks/useCachedResources';
import { StatusBar } from 'expo-status-bar';
import Navigation from '@/navigation';




export default function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Navigation />
                <StatusBar />
            </GestureHandlerRootView>
        );
    }
}
