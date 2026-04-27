/**
 * WikipediaService.js
 * All Wikipedia MediaWiki API interactions in one place.
 *
 * ARCHITECTURE:
 *  - Queued, throttled fetcher to avoid Wikipedia 429 rate limits
 *  - In-memory cache so the same URL is never fetched twice
 *  - Rich city-specific fallback data with real images so the app
 *    always looks polished even when Wikipedia blocks us
 */

const BASE = 'https://en.wikipedia.org/w/api.php'
const CORS  = '&origin=*'

import { discoverHeritageSites } from './GroqService'
import { supabase } from '../lib/SupabaseClient'

/* ═══════════════════════════════════════════
   QUEUED + CACHED FETCHER
   ═══════════════════════════════════════════ */
const fetchCache = new Map() // Persistent session cache
const queue = []
let busy  = false

async function drainQueue() {
  if (busy || queue.length === 0) return
  busy = true
  const { url: fetchUrl, resolve } = queue.shift()

  try {
    const ctrl = new AbortController()
    const tid  = setTimeout(() => ctrl.abort(), 3500)
    const res  = await fetch(fetchUrl, { signal: ctrl.signal })
    clearTimeout(tid)

    if (!res.ok) { resolve(null); }
    else {
      const txt = await res.text()
      try   { 
        const j = JSON.parse(txt); 
        
        // Prevent caching internal Wikipedia errors (like quota limitations masked as 200 OK)
        if (j.error || j.warnings) {
          console.warn('Wikipedia API internal error/warning:', j.error || j.warnings)
          resolve(null)
          return
        }

        fetchCache.set(fetchUrl, j); 
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        supabase.from('wiki_cache').upsert({ query_key: fetchUrl, response_data: j, expires_at: expiresAt }).catch(() => {});
        resolve(j) 
      }
      catch { resolve(null) }
    }
  } catch (e) {
    if (e.name !== 'AbortError') console.error('Wiki net err:', e)
    resolve(null)
  }

  // 250ms gap between Wikipedia requests — very polite
  setTimeout(() => { busy = false; drainQueue() }, 250)
}

async function safeFetch(u) {
  if (fetchCache.has(u)) return fetchCache.get(u)
  
  // Try Supabase persistent cache (skip expired rows)
  try {
    const { data } = await supabase
      .from('wiki_cache')
      .select('response_data, expires_at')
      .eq('query_key', u)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
    if (data?.response_data) {
      fetchCache.set(u, data.response_data)
      return data.response_data
    }
  } catch (e) { /* silent fail, continue to network */ }

  return new Promise(r => { queue.push({ url: u, resolve: r }); drainQueue() })
}

/** Build a URL with common params */
const mkUrl = (params) =>
  `${BASE}?format=json${CORS}&${new URLSearchParams(params).toString()}`

import { getFallbackSites as getStateFallbackSites } from '../data/StateData'

// Generic fallback for cities we don't have specific data for
const GENERIC_FALLBACK = []

/** Get city-specific fallback sites or generic ones */
function getFallbackSites(location = '', query = '') {
  const sites = getStateFallbackSites(location)
  const qLower = query.toLowerCase()

  if (qLower) {
    const filtered = sites.filter(s => s.title.toLowerCase().includes(qLower) || s.snippet.toLowerCase().includes(qLower))
    if (filtered.length > 0) return filtered
  }
  return sites
}

// Filter out junk Wikipedia results
const JUNK_PATTERNS = /\(film\)|\(beetle\)|\(insect\)|\(band\)|\(song\)|\(album\)|\(TV\)|metro|district|railway|cricket|football|university|college|airport|constituency|lok sabha|vidhan sabha|block\)/i

export async function searchWikipedia(query, limit = 6) {
  const aiResults = await discoverHeritageSites(query, 'search')
  if (aiResults.length > 0) return aiResults.slice(0, 6)

  const heritageQuery = `${query} heritage monument temple fort palace`
  const endpoint = mkUrl({
    action: 'query', list: 'search',
    srsearch: heritageQuery, srlimit: 6,
    srprop: 'snippet|titlesnippet',
  })
  const data = await safeFetch(endpoint)
  const results = (data?.query?.search ?? []).filter(r => !JUNK_PATTERNS.test(r.title))
  if (results.length > 0) return results.slice(0, 6)

  return getFallbackSites('', query).slice(0, 6)
}

export async function geoSearchHeritage(lat, lon, radius = 10000, limit = 50, city = '') {
  const endpoint = mkUrl({
    action: 'query', list: 'geosearch',
    gscoord: `${lat}|${lon}`, gsradius: radius,
    gslimit: limit, gsnamespace: 0,
  })
  const data    = await safeFetch(endpoint)
  const results = data?.query?.geosearch ?? []
  
  if (results.length === 0) {
    const hardcoded = getFallbackSites(city)
    if (hardcoded.length > 0) {
      return hardcoded.map(s => ({ ...s, lat, lon, dist: Math.floor(Math.random() * 5000) })).slice(0, limit)
    }
    const aiResults = await discoverHeritageSites(city, 'sites')
    if (aiResults.length > 0) return aiResults
    return []
  }
  return results
}

export async function getArticleSummary(pageId, titleHint = '') {
  const isAI = typeof pageId === 'string' && pageId.startsWith('ai-')

  if (typeof pageId === 'number' && pageId >= 10000) {
    // Actually we don't need to return hardcoded image details if we use thumbnail field directly from STATE_HERITAGE
    // But keeping it safe just in case getArticleSummary is called with these page IDs
    const fb = getStateFallbackSites('').find(s => s.pageid === pageId)
    if (fb) {
      return {
        extract:   fb.snippet,
        thumbnail: fb.thumbnail,
        url: '#',
        title: fb.title,
      }
    }
    return null
  }

  const searchId = isAI ? null : pageId
  const searchTitle = isAI ? titleHint : null

  const params = {
    action:      'query',
    prop:        'extracts|pageimages|info',
    exintro:     true,
    explaintext: true,
    exsentences: 4,
    piprop:      'thumbnail',
    pithumbsize: 400,
    inprop:      'url',
  }

  if (searchId) params.pageids = searchId
  else if (searchTitle) params.titles = searchTitle

  const endpoint = mkUrl(params)
  const data = await safeFetch(endpoint)
  const pages = data?.query?.pages
  if (!pages) return null
  
  const page = searchId ? pages[searchId] : Object.values(pages)[0]
  if (!page || page.missing === "") return null

  return {
    extract:   page?.extract   ?? '',
    thumbnail: page?.thumbnail?.source ?? null,
    url:       page?.fullurl   ?? `https://en.wikipedia.org/?curid=${page.pageid}`,
    title:     page?.title     ?? '',
  }
}

export async function getMultiSummary(items) {
  if (!items || items.length === 0) return []
  const pageIds = items.filter(i => typeof i.pageid === 'number').map(i => i.pageid)
  const titles = items.filter(i => !i.pageid && i.title).map(i => i.title)

  const params = {
    action:      'query',
    prop:        'extracts|pageimages|info',
    exintro:     true,
    explaintext: true,
    exsentences: 1,
    piprop:      'thumbnail',
    pithumbsize: 400,
    inprop:      'url',
  }

  if (pageIds.length > 0) params.pageids = pageIds.join('|')
  if (titles.length > 0) params.titles = titles.join('|')

  const endpoint = mkUrl(params)
  const data = await safeFetch(endpoint)
  const pages = data?.query?.pages ?? {}
  
  return Object.values(pages).map(p => ({
    pageid: p.pageid,
    title: p.title,
    extract: p.extract || '',
    thumbnail: p.thumbnail?.source || null,
    url: p.fullurl || `https://en.wikipedia.org/?curid=${p.pageid}`
  }))
}

import { STATE_COORDS } from '../data/StateData'

export async function geocodeCityIndia(city) {
  const key = city.trim().toLowerCase()
  if (STATE_COORDS[key]) return STATE_COORDS[key]

  try {
    const endpoint = mkUrl({ action: 'query', list: 'search', srsearch: `${city} India`, srlimit: 1 })
    const data = await safeFetch(endpoint)
    const page = data?.query?.search?.[0]
    if (!page) return null
    const coordUrl = mkUrl({ action: 'query', pageids: page.pageid, prop: 'coordinates' })
    const coordData = await safeFetch(coordUrl)
    const coords = coordData?.query?.pages?.[page.pageid]?.coordinates?.[0]
    if (coords) return { lat: coords.lat, lon: coords.lon }
  } catch (_) { /* ignore */ }
  return null
}

import { getFallbackIcons } from '../data/StateData'

export async function fetchHeritageIcons(city) {
  const icons = getFallbackIcons(city)
  if (icons && icons.length > 0 && icons[0].pageid !== 'icon-def-1') return icons
  
  const aiIcons = await discoverHeritageSites(city, 'icons')
  if (aiIcons.length > 0) return aiIcons
  return await searchWikipedia(`${city} history famous people`, 4)
}

const img = (file) => `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`;

export const GLOBAL_HERITAGE_POOL = [
  { title: "Taj Mahal", thumbnail: img('Taj Mahal in March 2004.jpg'), type: 'site' },
  { title: "Hawa Mahal", thumbnail: img('Hawa Mahal 2011.jpg'), type: 'site' },
  { title: "Qutub Minar", thumbnail: img('Qutb Minar mbread.jpg'), type: 'site' },
  { title: "Amber Fort", thumbnail: img('Amber Fort, Jaipur.jpg'), type: 'site' },
  { title: "Red Fort", thumbnail: img('Red Fort in Delhi 03-2016.jpg'), type: 'site' },
  { title: "Konark Sun Temple", thumbnail: img('Konark Sun Temple (2).jpg'), type: 'site' },
  { title: "Golden Temple", thumbnail: img('Amritsar Golden Temple.jpg'), type: 'site' },
  { title: "Gateway of India", thumbnail: img('Gateway of India at night.jpg'), type: 'site' },
  { title: "Meenakshi Temple", thumbnail: img('Meenakshi Amman West Tower.jpg'), type: 'site' },
  { title: "Ajanta Caves", thumbnail: img('Ajanta Caves 01.jpg'), type: 'site' },
  { title: "Victoria Memorial", thumbnail: img('Victoria Memorial Kolkata.jpg'), type: 'site' },
  { title: "Humayun's Tomb", thumbnail: img("Humayun's Tomb, Delhi.jpg"), type: 'site' },
  { title: "Shivaji", thumbnail: img('Shivaji British Museum.jpg'), type: 'person' },
  { title: "Maharana Pratap", thumbnail: img('Maharana Pratap.jpg'), type: 'person' },
  { title: "Akbar the Great", thumbnail: img('Akbar holding a globe.jpg'), type: 'person' },
  { title: "Rani Lakshmibai", thumbnail: img('Rani of Jhansi.jpg'), type: 'person' },
  { title: "Shah Jahan", thumbnail: img('Shah Jahan portrait.jpg'), type: 'person' },
  { title: "Ashoka the Great", thumbnail: img('Ashoka Pillar at Vaishali.jpg'), type: 'person' },
  { title: "Krishnadevaraya", thumbnail: img('Krishnadeva Raya.jpg'), type: 'person' },
  { title: "Guru Nanak", thumbnail: img('Guru Nanak Dev.jpg'), type: 'person' },
  { title: "Swami Vivekananda", thumbnail: img('Swami Vivekananda 1893.jpg'), type: 'person' },
  { title: "Ranjit Singh", thumbnail: img('Maharaja Ranjit Singh profile.jpg'), type: 'person' },
  { title: "Chanakya", thumbnail: img('Chanakya statue.jpg'), type: 'person' },
  { title: "B. R. Ambedkar", thumbnail: img('Dr. Babasaheb Ambedkar.jpg'), type: 'person' },
];

export function getInstantHeritage(level = 1) {
  const shuffled = [...GLOBAL_HERITAGE_POOL].sort(() => Math.random() - 0.5);
  if (level === 1) return shuffled.filter(i => i.type === 'site').slice(0, 6);
  const sites = shuffled.filter(i => i.type === 'site').slice(0, 3);
  const people = shuffled.filter(i => i.type === 'person').slice(0, 3);
  return [...sites, ...people].sort(() => Math.random() - 0.5);
}
