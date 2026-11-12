// Public PostHog project key: safe to include in this static site's source.
(() => {
  const key = 'phc_yBF5paRVPstNyzb64AA3CYRT5iSUh8WosrMBenqPxshQ';
  const host = 'https://us.i.posthog.com';
  if (!/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;

  // Visit ?analytics=off once to exclude this browser on every page.
  // Visit ?analytics=on to resume tracking. The choice stays on this origin.
  const choiceKey = 'harsh-portfolio-analytics';
  const url = new URL(location.href);
  const choice = url.searchParams.get('analytics');
  if (choice === 'off' || choice === 'on') {
    try {
      if (choice === 'off') localStorage.setItem(choiceKey, 'off');
      else localStorage.removeItem(choiceKey);
    } catch { /* Private browsing may block storage; this visit still respects off. */ }
    url.searchParams.delete('analytics');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  let excluded = choice === 'off';
  if (choice !== 'on') {
    try { excluded ||= localStorage.getItem(choiceKey) === 'off'; } catch { /* Storage unavailable. */ }
  }
  if (excluded) return;

  let ready = false;
  const queued = [];
  window.siteAnalytics = {
    capture(event, properties = {}, options) {
      if (ready) window.posthog.capture(event, properties, options);
      else queued.push([event, properties, options]);
    }
  };

  // PostHog's official async browser snippet, kept here so all static pages share it.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once unregister unregister_for_session unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRender getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupProperties setGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  window.posthog.init(key, {
    api_host: host,
    defaults: '2026-08-30',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'never',
    loaded() {
      ready = true;
      queued.splice(0).forEach(([event, properties, options]) => window.posthog.capture(event, properties, options));
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href="headwig/"]').forEach((link) => {
      link.addEventListener('click', () => window.siteAnalytics.capture('headwig_link_clicked'));
    });
    document.querySelectorAll('[data-analytics-event]').forEach((link) => {
      link.addEventListener('click', () => {
        const { analyticsEvent, placement, screenshot, guide } = link.dataset;
        const properties = { placement };
        if (screenshot) properties.screenshot = screenshot;
        if (guide) properties.guide = guide;
        // Flush outbound clicks promptly without delaying navigation.
        window.siteAnalytics.capture(analyticsEvent, properties, { send_instantly: true });
      });
    });
    const video = document.querySelector('.demo video');
    if (video) {
      video.addEventListener('play', () => window.siteAnalytics.capture('headwig_demo_played'));
      video.addEventListener('ended', () => window.siteAnalytics.capture('headwig_demo_completed'));
    }
    document.querySelectorAll('.waitlist-trigger').forEach((button) => {
      const placement = button.classList.contains('intro-cta') ? 'above_video'
        : button.classList.contains('demo-cta') ? 'on_video' : 'below_video';
      button.addEventListener('click', () => window.siteAnalytics.capture('headwig_waitlist_opened', { placement }));
    });
  });
})();
