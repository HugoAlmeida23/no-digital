import { supabase } from './supabase';

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('nd_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('nd_session', sessionId);
  }
  return sessionId;
}

// Track page view
export async function trackPageView() {
  const sessionId = getSessionId();

  await supabase.from('analytics_pageviews').insert({
    page: window.location.pathname,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    session_id: sessionId,
  });
}

// Track custom event
export async function trackEvent(eventType: string, eventData: Record<string, unknown> = {}) {
  const sessionId = getSessionId();

  await supabase.from('analytics_events').insert({
    session_id: sessionId,
    page: window.location.pathname,
    event_type: eventType,
    event_data: eventData,
  });
}

// Track clicks on important elements
export function trackClicks() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a, button');
    if (!link) return;

    const data: Record<string, unknown> = {
      tag: link.tagName.toLowerCase(),
      text: link.textContent?.trim().slice(0, 50),
      x: e.clientX,
      y: e.clientY,
    };

    if (link instanceof HTMLAnchorElement) {
      data.href = link.href;
    }

    if (link.id) data.id = link.id;
    if (link.className) data.class = link.className.split(' ').slice(0, 3).join(' ');

    trackEvent('click', data);
  });
}

// Track scroll depth
export function trackScrollDepth() {
  let maxScroll = 0;
  const thresholds = [25, 50, 75, 100];
  const tracked = new Set<number>();

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const percent = Math.round((window.scrollY / scrollHeight) * 100);
    if (percent > maxScroll) {
      maxScroll = percent;

      for (const threshold of thresholds) {
        if (percent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackEvent('scroll_depth', { percent: threshold });
        }
      }
    }
  });
}

// Track time on page
export function trackTimeOnPage() {
  const startTime = Date.now();

  // Track on visibility change (more reliable than beforeunload)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const seconds = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', { seconds });
    }
  });
}

// Initialize all tracking
export function initAnalytics() {
  trackPageView();
  trackClicks();
  trackScrollDepth();
  trackTimeOnPage();
}
