// Removed AsyncStorage import

export const store = async <State>(key: string, state: State) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

export const load = async <ReturnValue>(key: string, feedback: any): Promise<ReturnValue | null> => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    if (feedback && typeof feedback.send === 'function') {
      feedback.send({
        type: "issue",
        message: JSON.stringify({
          title: "Error loading logs",
          description: error.message,
          trace: error.stack,
        }),
        email: "team@pixy.day",
        source: "error",
        onCancel: () => {},
        onOk: () => {}
      });
    }
    return null;
  }
};
