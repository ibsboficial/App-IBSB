// ============================================================
// IBSB — DataContext
// Carrega os dados (demo via localStorage ou Supabase), aplica
// o seed e expõe CRUD para a aplicação inteira.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { backend } from '../data/backend';
import { seedNetworks } from '../data/mockData';
import { APP, BRAND, DEFAULT_CHURCH_INFO } from '../config/appConfig';

const DataContext = createContext(null);

const COLLECTIONS = ['services', 'events', 'sermons', 'devotionals', 'prayers', 'news', 'gallery'];

export function DataProvider({ children }) {
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [devotionals, setDevotionals] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [ready, setReady] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      if (backend.mode === 'demo') backend.seedDemo();
      const [s, e, se, de, pr, n, g, set] = await Promise.all([
        backend.all('services'),
        backend.all('events'),
        backend.all('sermons'),
        backend.all('devotionals'),
        backend.all('prayers'),
        backend.all('news'),
        backend.all('gallery'),
        backend.settingsGet(),
      ]);
      setServices(s);
      setEvents(e);
      setSermons(se);
      setDevotionals(de);
      setPrayers(pr);
      setNews(n);
      setGallery(g);
      setSettings(set || DEFAULT_CHURCH_INFO);
    } catch (err) {
      console.error('Falha ao carregar os dados:', err);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const value = useMemo(() => {
    const sortByDateAsc = (list) =>
      [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortByDateDesc = (list) =>
      [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

    const listOf = (name) => {
      const map = {
        services, events, sermons, devotionals, prayers, news, gallery,
      };
      return map[name] || [];
    };

    const setterOf = (name) => {
      const map = {
        services: setServices,
        events: setEvents,
        sermons: setSermons,
        devotionals: setDevotionals,
        prayers: setPrayers,
        news: setNews,
        gallery: setGallery,
      };
      return map[name] || (() => {});
    };

    const makeCrud = (name) => {
      const setter = setterOf(name);
      return {
        all: () => listOf(name),
        get: (id) => listOf(name).find((item) => item.id === id) || null,
        add: async (data) => {
          const r = await backend.insert(name, data);
          setter(await backend.all(name));
          return r;
        },
        update: async (id, data) => {
          const r = await backend.update(name, id, data);
          setter(await backend.all(name));
          return r;
        },
        remove: async (id) => {
          await backend.remove(name, id);
          setter(await backend.all(name));
        },
      };
    };

    const updateSettings = async (patch) => {
      const merged = { ...(settings || DEFAULT_CHURCH_INFO), ...patch };
      await backend.settingsSet(merged);
      setSettings(merged);
      return merged;
    };

    const crud = {};
    COLLECTIONS.forEach((name) => {
      crud[name] = makeCrud(name);
    });
    crud.settings = {
      get: () => settings,
      update: updateSettings,
    };

    // Configuração dinâmica da marca, derivada de settings.
    // O administrador pode alterar nome, logo, cores etc. pelo painel.
    const identity = settings?.identity || {};
    const branding = settings?.branding || {};
    const colors = settings?.colors || {};
    const app = {
      name: identity.name || APP.name,
      fullName: identity.fullName || APP.fullName,
      tagline: identity.tagline || APP.tagline,
      pastorName: identity.pastorName || '',
      pastorRole: identity.pastorRole || 'Pastor titular',
      logoUrl: branding.logoLight || APP.logoUrl,
      logoDark: branding.logoDark || '',
      favicon: branding.favicon || '',
      homeBackground: branding.homeBackground || '',
      homeBanner: branding.homeBanner || '',
      featuredImage: branding.featuredImage || '',
      pageImages: branding.pageImages || {},
      colors: {
        primary: colors.primary || BRAND.primary,
        primaryDark: colors.primaryDark || BRAND.primaryDark,
        primaryLight: colors.primaryLight || BRAND.primaryLight,
        accent: colors.accent || BRAND.accent,
      },
    };

    return {
      ready,
      services,
      events,
      sermons,
      devotionals,
      prayers,
      news,
      gallery,
      settings,
      networks: seedNetworks(),
      app,

      // Helpers derivados
      upcomingServices: sortByDateAsc(
        services.filter((s) => new Date(s.date) >= new Date(Date.now() - 3 * 60 * 60 * 1000)),
      ),
      upcomingEvents: sortByDateAsc(
        events.filter((e) => new Date(e.date) >= new Date(Date.now() - 3 * 60 * 60 * 1000)),
      ),
      recentSermons: sortByDateDesc(sermons),
      recentDevotionals: sortByDateDesc(devotionals),
      recentNews: sortByDateDesc(news),

      // CRUD
      crud,

      // Recarrega tudo (útil após importar dados demo no Supabase)
      reload: loadAll,
    };
  }, [ready, services, events, sermons, devotionals, prayers, news, gallery, settings, loadAll]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData deve ser usado dentro de <DataProvider>');
  return ctx;
}
