import { createContext, useCallback, useContext, useState } from 'react';
import { Toast, ToastMessage, ToastType } from '@/components/Toast';
import { v4 as uuidv4 } from 'uuid';
import { View } from 'react-native';




interface ToastContextType {
    show: (message: string, type?: ToastType, duration?: number) => void;
}


const ToastContext = createContext<ToastContextType | undefined>(undefined);


export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);


    const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = uuidv4();
        const newToast: ToastMessage = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);
    }, []);


    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);


    return (
        <ToastContext.Provider value={{ show }}>
            <View style={{ flex: 1, position: 'relative' }}>
                {children}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    pointerEvents="box-none"
                >
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onDismiss={() => removeToast(toast.id)}
                        />
                    ))}
                </View>
            </View>
        </ToastContext.Provider>
    );
}


export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}
