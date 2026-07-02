/*!
 * Bombay Gothic — PostHog analytics for bombaygothic.com (main site)
 * Self-hosted PostHog: https://posthog.anmolmathur.com
 * Loaded on every page via: <script defer src="/js/bg-analytics.js"></script>
 *
 * Custom events captured (see EVENTS.md in bg-command-center):
 *   menu_click          — header/footer nav interactions
 *   shop_link_click     — any click out to shop.bombaygothic.com (funnel step 2)
 *   catalogue_download  — PDF catalogue downloads
 *   social_click        — Instagram etc.
 *   whatsapp_click      — WhatsApp CTA
 *   email_click         — mailto: links
 *   form_submit         — contact / enquiry forms
 */
(function () {
    // ---- Official PostHog JS snippet (loads /static/array.js from our instance) ----
    !(function (t, e) {
        var o, n, p, r;
        e.__SV ||
            ((window.posthog = e),
            (e._i = []),
            (e.init = function (i, s, a) {
                function g(t, e) {
                    var o = e.split('.');
                    2 == o.length && ((t = t[o[0]]), (e = o[1]));
                    t[e] = function () {
                        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                }
                ((p = t.createElement('script')).type = 'text/javascript');
                p.crossOrigin = 'anonymous';
                p.async = !0;
                p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
                (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
                var u = e;
                void 0 !== a ? (u = e[a] = []) : (a = 'posthog');
                u.people = u.people || [];
                u.toString = function (t) {
                    var e = 'posthog';
                    'posthog' !== a && (e += '.' + a);
                    t || (e += ' (stub)');
                    return e;
                };
                u.people.toString = function () {
                    return u.toString(1) + '.people (stub)';
                };
                o =
                    'init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug'.split(
                        ' '
                    );
                for (n = 0; n < o.length; n++) g(u, o[n]);
                e._i.push([i, s, a]);
            }),
            (e.__SV = 1));
    })(document, window.posthog || []);

    posthog.init('phc_kCSqexa3kxi9tWKNnr6cNfBkyrF47XkLpWjaPBQcVrpK', {
        api_host: 'https://posthog.anmolmathur.com',
        defaults: '2025-05-24',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: 'localStorage+cookie',
    });

    // Register the property on every event from this site
    posthog.register({ bg_property: 'main_site' });

    // ---- Custom behaviour events (delegated listeners) ----
    var MAXLEN = 80;
    function txt(el) {
        return ((el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ')).slice(0, MAXLEN);
    }

    document.addEventListener(
        'click',
        function (ev) {
            var el = ev.target && ev.target.closest ? ev.target.closest('a, button') : null;
            if (!el || !window.posthog) return;
            var href = el.getAttribute('href') || '';
            var label = txt(el);
            var page = location.pathname;

            // 1. Menu clicks (header nav, mobile menu, footer nav)
            if (el.closest('nav, header, [data-menu], #mobile-menu, footer')) {
                if (el.closest('nav') || el.closest('#mobile-menu')) {
                    posthog.capture('menu_click', {
                        menu_item: label,
                        menu_href: href,
                        menu_location: el.closest('#mobile-menu') ? 'mobile' : el.closest('footer') ? 'footer' : 'header',
                        page: page,
                    });
                }
            }

            // 2. Click-out to the Shopify store — funnel step: Site -> Shop
            if (href.indexOf('shop.bombaygothic.com') !== -1) {
                var m = href.match(/\/products\/([^\/?#]+)/);
                var c = href.match(/\/collections\/([^\/?#]+)/);
                posthog.capture('shop_link_click', {
                    destination_url: href,
                    cta_text: label,
                    page: page,
                    product_handle: m ? m[1] : null,
                    collection_handle: c ? c[1] : null,
                });
            }

            // 3. Catalogue PDF downloads
            if (/\.pdf(\?|#|$)/i.test(href)) {
                posthog.capture('catalogue_download', { file: href, page: page });
            }

            // 4. Social / contact CTAs
            if (href.indexOf('instagram.com') !== -1) {
                posthog.capture('social_click', { network: 'instagram', page: page });
            }
            if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
                posthog.capture('whatsapp_click', { page: page, cta_text: label });
            }
            if (href.indexOf('mailto:') === 0) {
                posthog.capture('email_click', { page: page });
            }
        },
        true
    );

    // 5. Contact / enquiry form submissions
    document.addEventListener(
        'submit',
        function (ev) {
            if (!window.posthog) return;
            var f = ev.target;
            posthog.capture('form_submit', {
                form_id: f.id || f.getAttribute('name') || f.getAttribute('action') || 'unknown',
                page: location.pathname,
            });
        },
        true
    );
})();
