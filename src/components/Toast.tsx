import { Animated, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import useColors from '@/hooks/useColors';




export type ToastType = 'error' | 'success' | 'info';


export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}


export const Toast = ({
    message,
    type = 'info',
    duration = 3000,
    onDismiss
}: {
    message: string;
    type?: ToastType;
    duration?: number;
    onDismiss: () => void;
}) => {

    const colors = useColors();
    const [fadeAnim] = useState(new Animated.Value(0));


    useEffect(() => {
        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto dismiss
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                onDismiss();
            });
        }, duration);

        return () => clearTimeout(timer);
    }, []);


    const backgroundColor = {
        error: colors.toastBackgroundError,
        success: colors.toastBackgroundSuccess,
        info: colors.toastBackgroundInfo,
    }[type];


    const textColor = type === 'success' ? colors.toastTextSuccess : colors.text;


    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                position: 'absolute',
                bottom: 100, // Position above the save button
                left: 20,
                right: 20,
                backgroundColor,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                zIndex: 999,
            }}
        >
            <Text
                style={{
                    color: textColor,
                    fontSize: 14,
                    fontWeight: '500',
                    textAlign: 'center',
                }}
            >
                {message}
            </Text>
        </Animated.View>
    );
};
