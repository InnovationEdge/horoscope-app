// Deep link utility functions

import { router } from 'expo-router';

// Deep link target mappings
export function parseDeepLinkTarget(target: string): { route: string; params?: Record<string, string> } {
  switch (true) {
    case target.startsWith('traits:'):
      const traitsSign = target.split(':')[1];
      return {
        route: '/(tabs)/traits',
        params: { sign: traitsSign },
      };

    case target.startsWith('compat:'):
      const compatSign = target.split(':')[1];
      return {
        route: '/(tabs)/compat',
        params: { with: compatSign },
      };

    case target === 'druid':
      return { route: '/(tabs)/druid' };

    case target === 'chinese':
      return {
        route: '/(tabs)/druid',
        params: { mode: 'chinese' },
      };

    case target === 'premium':
      return { route: '/paywall' };

    default:
      return { route: '/(tabs)/today' };
  }
}

// Navigate using deep link target
export function navigateToTarget(target: string, source?: string) {
  const { route, params } = parseDeepLinkTarget(target);

  // Build query string if params exist
  let finalRoute = route;
  if (params) {
    const queryParams = new URLSearchParams(params);
    if (source && route === '/paywall') {
      queryParams.set('src', source);
    }
    finalRoute = `${route}?${queryParams.toString()}`;
  } else if (source && route === '/paywall') {
    finalRoute = `${route}?src=${source}`;
  }

  router.push(finalRoute);
}

// Check if target requires premium access
export function isTargetPremiumRequired(target: string): boolean {
  return target === 'premium';
}

// Generate paywall source from context
export function getPaywallSource(context: string, id?: string): string {
  if (id) {
    return `${context}_${id}`;
  }
  return context;
}
