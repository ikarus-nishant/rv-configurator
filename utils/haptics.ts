/**
 * Triggers a light haptic feedback.
 * Note: navigator.vibrate is supported on Android Chrome. 
 * iOS Safari currently does not support the Web Vibration API,
 * but this utility follows standard web practices for haptics.
 */
export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Silent fail for non-supported browsers
    }
  }
};
