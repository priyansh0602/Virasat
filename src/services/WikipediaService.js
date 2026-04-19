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

/* ═══════════════════════════════════════════
   CITY-SPECIFIC FALLBACK DATA
   Complete with titles, descriptions, and
   Wikipedia Special:FilePath images that
   always resolve correctly.
   ═══════════════════════════════════════════ */
const img = (file) => `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`

const CITY_FALLBACKS = {
  udaipur: [
    { pageid: 90001, title: 'City Palace, Udaipur',     snippet: 'A majestic palace complex on the east bank of Lake Pichola, built over 400 years by successive Mewar rulers.',   thumbnail: img('Udaipur City Palace.jpg') },
    { pageid: 90002, title: 'Lake Palace',              snippet: 'A stunning white marble palace floating on Lake Pichola, once a summer retreat for the Mewar dynasty.',          thumbnail: img('Taj Lake Palace.jpg') },
    { pageid: 90003, title: 'Kumbhalgarh',              snippet: 'A massive Mewar fortress with the second-longest wall in the world, a UNESCO World Heritage Site.',             thumbnail: img('Kumbhalgarh 03.jpg') },
    { pageid: 90004, title: 'Jagdish Temple',           snippet: 'An ornately carved Indo-Aryan temple dedicated to Lord Vishnu, built in 1651 in the heart of Udaipur.',          thumbnail: img('Jagdish Temple, Udaipur 01.jpg') },
  ],
  varanasi: [
    { pageid: 91001, title: 'Kashi Vishwanath Temple',  snippet: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, the most famous temple in Varanasi.',                  thumbnail: img('Kashi Vishwanath Temple Varanasi.jpg') },
    { pageid: 91002, title: 'Dashashwamedh Ghat',       snippet: 'The main ghat in Varanasi on the banks of the Ganges, famous for its spectacular Ganga Aarti ceremony.',        thumbnail: img('Dasaswamedh ghat on river ganges.jpg') },
    { pageid: 91003, title: 'Sarnath',                  snippet: 'Where Buddha gave his first sermon; home to the iconic Ashoka Pillar and ancient Buddhist ruins.',               thumbnail: img('Dhamek Stupa, Sarnath.jpg') },
    { pageid: 91004, title: 'Ramnagar Fort',            snippet: 'An 18th-century fort on the eastern bank of the Ganges, serving as the seat of the Maharaja of Benares.',        thumbnail: img('Ramnagar Fort Varanasi.jpg') },
  ],
  jaipur: [
    { pageid: 92001, title: 'Hawa Mahal',               snippet: 'The "Palace of Winds" — a stunning pink sandstone façade with 953 small windows for royal ladies to observe the street.', thumbnail: img('Hawa Mahal 2011.jpg') },
    { pageid: 92002, title: 'Amber Fort',               snippet: 'A magnificent hilltop fort blending Rajput and Mughal architecture, overlooking Maota Lake.',                    thumbnail: img('Amber Fort, Jaipur.jpg') },
    { pageid: 92003, title: 'City Palace, Jaipur',      snippet: 'A sprawling complex of courtyards, gardens, and buildings blending Rajput and Mughal styles.',                   thumbnail: img('City Palace Jaipur.jpg') },
    { pageid: 92004, title: 'Jantar Mantar, Jaipur',    snippet: 'A UNESCO World Heritage collection of 19 astronomical instruments built by Sawai Jai Singh II.',                 thumbnail: img('Jantar Mantar at Jaipur.jpg') },
  ],
  agra: [
    { pageid: 93001, title: 'Taj Mahal',                snippet: 'An ivory-white marble mausoleum on the bank of the Yamuna, one of the Seven Wonders of the World.',              thumbnail: img('Taj Mahal in March 2004.jpg') },
    { pageid: 93002, title: 'Agra Fort',                snippet: 'A UNESCO World Heritage Site and the main residence of the emperors of the Mughal Dynasty until 1638.',           thumbnail: img('Agra Fort.jpg') },
    { pageid: 93003, title: 'Fatehpur Sikri',           snippet: 'A 16th-century city built by Emperor Akbar, abandoned after only 14 years due to lack of water.',                thumbnail: img('Fatehpur Sikri Buland Darwaza gate 2010.jpg') },
    { pageid: 93004, title: "Itimad-ud-Daulah's Tomb",  snippet: 'Often called the "Baby Taj," this exquisite Mughal mausoleum is a precursor to the Taj Mahal.',                 thumbnail: img("Tomb of Itimad-ud-Daulah 01.jpg") },
  ],
  delhi: [
    { pageid: 94001, title: 'Red Fort',                 snippet: 'A historic fort in Old Delhi serving as the main residence of the Mughal emperors for nearly 200 years.',          thumbnail: img('Red Fort in Delhi 03-2016.jpg') },
    { pageid: 94002, title: 'Qutub Minar',              snippet: 'A 73-metre tall minaret built in 1193, one of the earliest and most prominent examples of Indo-Islamic architecture.', thumbnail: img('Qutb Minar mbread.jpg') },
    { pageid: 94003, title: "Humayun's Tomb",           snippet: "The tomb of the Mughal Emperor Humayun, it inspired the Taj Mahal's design two centuries later.",                 thumbnail: img("Humayun's Tomb, Delhi.jpg") },
    { pageid: 94004, title: 'India Gate',               snippet: 'A war memorial on the Kartavya Path, commemorating Indian soldiers who died in World War I.',                    thumbnail: img('India Gate in New Delhi 03-2016.jpg') },
  ],
  mumbai: [
    { pageid: 95001, title: 'Gateway of India',         snippet: 'An arch-monument built during the 20th century in Mumbai, overlooking the Arabian Sea.',                         thumbnail: img('Gateway of India at night.jpg') },
    { pageid: 95002, title: 'Chhatrapati Shivaji Terminus', snippet: 'A UNESCO World Heritage Site and historic railway station in Mumbai in Victorian Gothic Revival style.',       thumbnail: img('Chhatrapati Shivaji Terminus (Victoria Terminus).jpg') },
    { pageid: 95003, title: 'Elephanta Caves',          snippet: 'A UNESCO World Heritage network of sculpted caves dating back to the 5th–8th centuries on Elephanta Island.',     thumbnail: img('Elephanta Caves Trimurti.jpg') },
    { pageid: 95004, title: 'Haji Ali Dargah',          snippet: 'An iconic mosque and tomb on an islet off the coast of Mumbai, connected by a narrow causeway.',                  thumbnail: img('Haji ali.jpg') },
  ],
  hampi: [
    { pageid: 96001, title: 'Virupaksha Temple',        snippet: 'An ancient temple dedicated to Lord Shiva, one of the oldest functioning temples in India at Hampi.',             thumbnail: img('Virupaksha Temple Hampi.jpg') },
    { pageid: 96002, title: 'Vittala Temple',           snippet: 'Famous for its iconic stone chariot, the Vittala Temple is one of the most extravagant monuments in Hampi.',       thumbnail: img('Hampi vibread.jpg') },
    { pageid: 96003, title: 'Lotus Mahal',              snippet: 'A beautiful pavilion in the Zenana enclosure at Hampi, blending Hindu and Islamic architectural styles.',          thumbnail: img('Lotus Mahal at Hampi.jpg') },
    { pageid: 96004, title: 'Elephant Stables',         snippet: 'A grand structure with eleven domed chambers once used to house the royal elephants of the Vijayanagara Empire.',  thumbnail: img('Elephant Stable Hampi.jpg') },
  ],
  amritsar: [
    { pageid: 97001, title: 'Golden Temple',            snippet: 'Harmandir Sahib, the holiest Gurdwara and the most important pilgrimage site of Sikhism.',                        thumbnail: img('Amritsar Golden Temple.jpg') },
    { pageid: 97002, title: 'Jallianwala Bagh',         snippet: 'A public garden and memorial of national importance, the site of the 1919 Jallianwala Bagh massacre.',             thumbnail: img('Jallianwalabagh.jpg') },
    { pageid: 97003, title: 'Wagah Border',             snippet: 'Famous for the elaborate Beating Retreat ceremony at the India-Pakistan border near Amritsar.',                    thumbnail: img('Wagah border ceremony.jpg') },
    { pageid: 97004, title: 'Partition Museum',         snippet: 'The only museum in the Indian subcontinent fully dedicated to the Partition of India in 1947.',                    thumbnail: img('Town Hall, Amritsar.jpg') },
  ],
  kota: [
    { pageid: 99001, title: 'Garadia Mahadev',          snippet: 'A breathtaking viewpoint over the Chambal River canyon, featuring a small temple dedicated to Lord Shiva.',      thumbnail: img('Kota_Landscape_1.jpg') },
    { pageid: 99002, title: 'Seven Wonders Park',       snippet: 'A unique park featuring replicas of the Seven Wonders of the World, situated on the banks of Kishore Sagar Lake.', thumbnail: img('7wonders_Kota.jpg') },
    { pageid: 99003, title: 'Jagmandir Palace, Kota',   snippet: 'A beautiful red sandstone palace located in the middle of the Kishore Sagar lake, built by one of the queens of Kota.', thumbnail: img('Jag_Mandir_Kota_night.JPG') },
    { pageid: 99004, title: 'Kishore Sagar Lake',       snippet: 'An artificial lake built in 1346 by Prince Dehra of Bundi, featuring the stunning Jagmandir Palace in its centre.', thumbnail: img('Kishoresagar.JPG') },
  ],
}

// Generic fallback for cities we don't have specific data for
const GENERIC_FALLBACK = []

/** Get city-specific fallback sites or generic ones */
function getFallbackSites(city = '', query = '') {
  const cityKey = city.trim().toLowerCase()
  const qLower  = query.toLowerCase()

  if (CITY_FALLBACKS[cityKey]) {
    const sites = CITY_FALLBACKS[cityKey]
    if (qLower) {
      const filtered = sites.filter(s => s.title.toLowerCase().includes(qLower) || s.snippet.toLowerCase().includes(qLower))
      if (filtered.length > 0) return filtered
    }
    return sites
  }

  if (qLower) {
    const allSites = Object.values(CITY_FALLBACKS).flat()
    const matches  = allSites.filter(s => s.title.toLowerCase().includes(qLower) || s.snippet.toLowerCase().includes(qLower))
    if (matches.length > 0) return matches.slice(0, 4)
  }

  if (cityKey || qLower) {
    return []
  }

  return GENERIC_FALLBACK
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

  if (typeof pageId === 'number' && pageId >= 90000) {
    const allFallback = [...Object.values(CITY_FALLBACKS).flat(), ...GENERIC_FALLBACK]
    const fb = allFallback.find(s => s.pageid === pageId)
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

export async function geocodeCityIndia(city) {
  const CITY_COORDS = {
    'mumbai':      { lat: 18.9388, lon: 72.8354 },
    'delhi':       { lat: 28.6139, lon: 77.2090 },
    'new delhi':   { lat: 28.6139, lon: 77.2090 },
    'bangalore':   { lat: 12.9716, lon: 77.5946 },
    'bengaluru':   { lat: 12.9716, lon: 77.5946 },
    'hyderabad':   { lat: 17.3850, lon: 78.4867 },
    'chennai':     { lat: 13.0827, lon: 80.2707 },
    'kolkata':     { lat: 22.5726, lon: 88.3639 },
    'pune':        { lat: 18.5204, lon: 73.8567 },
    'ahmedabad':   { lat: 23.0225, lon: 72.5714 },
    'jaipur':      { lat: 26.9239, lon: 75.8267 },
    'surat':       { lat: 21.1702, lon: 72.8311 },
    'lucknow':     { lat: 26.8467, lon: 80.9462 },
    'kanpur':      { lat: 26.4499, lon: 80.3319 },
    'nagpur':      { lat: 21.1458, lon: 79.0882 },
    'indore':      { lat: 22.7196, lon: 75.8577 },
    'bhopal':      { lat: 23.2599, lon: 77.4126 },
    'patna':       { lat: 25.5941, lon: 85.1376 },
    'vadodara':    { lat: 22.3072, lon: 73.1812 },
    'agra':        { lat: 27.1751, lon: 78.0421 },
    'varanasi':    { lat: 25.3176, lon: 82.9739 },
    'banaras':     { lat: 25.3176, lon: 82.9739 },
    'srinagar':    { lat: 34.0837, lon: 74.7973 },
    'amritsar':    { lat: 31.6200, lon: 74.8765 },
    'jodhpur':     { lat: 26.2389, lon: 73.0243 },
    'madurai':     { lat: 9.9252,  lon: 78.1198 },
    'chandigarh':  { lat: 30.7333, lon: 76.7794 },
    'guwahati':    { lat: 26.1445, lon: 91.7362 },
    'mysore':      { lat: 12.2958, lon: 76.6394 },
    'mysuru':      { lat: 12.2958, lon: 76.6394 },
    'bhubaneswar': { lat: 20.2961, lon: 85.8245 },
    'udaipur':     { lat: 24.5854, lon: 73.7125 },
    'hampi':       { lat: 15.3350, lon: 76.4600 },
    'thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
    'trivandrum':  { lat: 8.5241, lon: 76.9366 },
    'shimla':      { lat: 31.1048, lon: 77.1734 },
    'haridwar':    { lat: 29.9457, lon: 78.1642 },
    'mathura':     { lat: 27.4924, lon: 77.6737 },
    'konark':      { lat: 19.8876, lon: 86.0945 },
    'khajuraho':   { lat: 24.8318, lon: 79.9199 },
    'gwalior':     { lat: 26.2183, lon: 78.1828 },
    'ajmer':       { lat: 26.4499, lon: 74.6399 },
    'pushkar':     { lat: 26.4897, lon: 74.5511 },
    'pondicherry': { lat: 11.9416, lon: 79.8083 },
    'puducherry':  { lat: 11.9416, lon: 79.8083 },
    'bodh gaya':   { lat: 24.6961, lon: 84.9914 },
    'sanchi':      { lat: 23.4793, lon: 77.7398 },
    'mahabalipuram': { lat: 12.6269, lon: 80.1927 },
    'tirupati':    { lat: 13.6288, lon: 79.4192 },
    'dwarka':      { lat: 22.2442, lon: 68.9685 },
    'somnath':     { lat: 20.9002, lon: 70.3725 },
    'gorakhpur':   { lat: 26.7606, lon: 83.3732 },
    'bikaner':     { lat: 28.0229, lon: 73.3119 },
    'ranchi':      { lat: 23.3441, lon: 85.3096 },
    'coimbatore':  { lat: 11.0168, lon: 76.9558 },
    'kota':        { lat: 25.1767, lon: 75.8333 },
  }

  const key = city.trim().toLowerCase()
  if (CITY_COORDS[key]) return CITY_COORDS[key]

  try {
    const endpoint = mkUrl({ action: 'query', list: 'search', srsearch: `${city} India city`, srlimit: 1 })
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

const CITY_ICONS = {
  udaipur: [
    { pageid: 'ai-1', title: 'Maharana Pratap',     snippet: 'The legendary Rajput warrior king of Mewar who fought the Mughal Empire and is celebrated for the Battle of Haldighati (1576).' },
    { pageid: 'ai-2', title: 'Rana Sanga',          snippet: 'Rana Sangram Singh, a powerful Rajput ruler who united Rajput clans and fought the Battle of Khanwa against Babur in 1527.' },
    { pageid: 'ai-3', title: 'Udai Singh II',       snippet: 'The founder of the city of Udaipur and ruler of Mewar who shifted his capital from Chittorgarh.' },
    { pageid: 'ai-4', title: 'Mewar Dynasty',       snippet: 'One of the oldest ruling dynasties in the world, the Mewar dynasty ruled from Chittorgarh and later Udaipur for over 1500 years.' },
  ],
  varanasi: [
    { pageid: 'ai-5', title: 'Kabir',               snippet: 'The mystic poet and saint of Varanasi whose verses questioned orthodox religiosity and influenced the Bhakti movement across India.' },
    { pageid: 'ai-6', title: 'Tulsidas',            snippet: 'The great poet-saint who composed the Ramcharitmanas, the Hindi retelling of the Ramayana, while living in Varanasi.' },
    { pageid: 'ai-7', title: 'Lal Bahadur Shastri', snippet: 'The second Prime Minister of India, born near Varanasi, known for the slogan "Jai Jawan Jai Kisan."' },
    { pageid: 'ai-8', title: 'Rani Lakshmibai',     snippet: 'The warrior queen of Jhansi who became a symbol of resistance during the Indian Rebellion of 1857.' },
  ],
  jaipur: [
    { pageid: 'ai-9', title: 'Sawai Jai Singh',     snippet: 'The founder of Jaipur, a mathematician and astronomer who built the Jantar Mantar observatories across India.' },
    { pageid: 'ai-10', title: 'Man Singh I',        snippet: 'A Rajput king and one of the "Nine Gems" of Akbar\'s court, he greatly expanded the Amber Fort.' },
    { pageid: 'ai-11', title: 'Gayatri Devi',       snippet: 'The last queen of Jaipur, renowned for her beauty and grace, she was a champion of women\'s education in Rajasthan.' },
    { pageid: 'ai-12', title: 'Prithviraj Chauhan', snippet: 'The last major Hindu king to rule Delhi and Ajmer, celebrated for his valor in the battles against Muhammad of Ghor.' },
  ],
  agra: [
    { pageid: 'ai-13', title: 'Shah Jahan',         snippet: 'The Mughal emperor who commissioned the Taj Mahal in memory of his beloved wife Mumtaz Mahal.' },
    { pageid: 'ai-14', title: 'Akbar',              snippet: 'The greatest Mughal emperor known for his policy of religious tolerance (Din-i-Ilahi) and administrative reforms.' },
    { pageid: 'ai-15', title: 'Mumtaz Mahal',       snippet: 'The chief consort of Shah Jahan, her death inspired the construction of the Taj Mahal, one of the world\'s greatest monuments.' },
    { pageid: 'ai-16', title: 'Nur Jahan',          snippet: 'The powerful Mughal empress, wife of Jahangir, considered the most powerful woman in Mughal history.' },
  ],
  delhi: [
    { pageid: 'ai-17', title: 'Prithviraj Chauhan', snippet: 'The last major Hindu king to rule Delhi, celebrated for his valor in battles against the Ghurid invasions.' },
    { pageid: 'ai-18', title: 'Razia Sultan',       snippet: 'The first and only woman to rule the Delhi Sultanate, she ruled from 1236 to 1240.' },
    { pageid: 'ai-19', title: 'Shah Jahan',         snippet: 'Mughal emperor who shifted the capital back to Delhi and built the Red Fort and Jama Masjid.' },
    { pageid: 'ai-20', title: 'Aruna Asaf Ali',     snippet: 'An Indian independence activist who hoisted the Indian flag during the Quit India Movement in 1942.' },
  ],
  mumbai: [
    { pageid: 'ai-21', title: 'Shivaji',            snippet: 'The founder of the Maratha Empire and a great warrior king who challenged Mughal and Bijapur dominions.' },
    { pageid: 'ai-22', title: 'B. R. Ambedkar',     snippet: 'The architect of the Indian Constitution, a social reformer who fought against caste discrimination.' },
    { pageid: 'ai-23', title: 'Dadabhai Naoroji',   snippet: 'The "Grand Old Man of India," the first Asian to be elected to the British House of Commons.' },
    { pageid: 'ai-24', title: 'Bal Gangadhar Tilak',snippet: 'A key leader of the Indian independence movement, known for the declaration "Swaraj is my birthright."' },
  ],
  hampi: [
    { pageid: 'ai-25', title: 'Krishnadevaraya',    snippet: 'The greatest ruler of the Vijayanagara Empire, a patron of art and literature who ruled during its golden age.' },
    { pageid: 'ai-26', title: 'Harihara I',         snippet: 'Co-founder of the Vijayanagara Empire along with his brother Bukka Raya I in 1336.' },
    { pageid: 'ai-27', title: 'Tenali Rama',        snippet: 'A legendary court jester and poet in Krishnadevaraya\'s court, famous for his wit and wisdom.' },
    { pageid: 'ai-28', title: 'Vijayanagara Empire',snippet: 'One of the greatest empires of South India (1336–1646), with its capital at Hampi, a UNESCO World Heritage Site.' },
  ],
  amritsar: [
    { pageid: 'ai-29', title: 'Guru Ram Das',       snippet: 'The fourth Sikh Guru who founded the city of Amritsar and began construction of the Golden Temple.' },
    { pageid: 'ai-30', title: 'Ranjit Singh',       snippet: 'The "Lion of Punjab" who founded the Sikh Empire and unified the Punjab region in the early 19th century.' },
    { pageid: 'ai-31', title: 'Bhagat Singh',       snippet: 'A revolutionary freedom fighter from Punjab who was martyred at age 23 for his role in the Indian independence movement.' },
    { pageid: 'ai-32', title: 'Udham Singh',        snippet: 'A revolutionary who assassinated Michael O\'Dwyer in London in 1940 to avenge the Jallianwala Bagh massacre.' },
  ],
  kota: [
    { pageid: 'ai-33', title: 'Madho Singh',        snippet: 'The first ruler of the independent state of Kota, an illustrious son of Rao Ratan Singh of Bundi who established Kota as a major power.' },
    { pageid: 'ai-34', title: 'Zalim Singh',         snippet: 'The extraordinary Regent of Kota who was a master diplomat, statesman, and the real power behind the throne for over 50 years.' },
    { pageid: 'ai-35', title: 'Umed Singh II',      snippet: 'A progressive Maharaja who modernized Kota\'s administration and was a patron of the arts and education.' },
    { pageid: 'ai-36', title: 'Hada Rajputs',       snippet: 'The warrior clan that ruled the regions of Hadoti (Kota, Bundi, Jhalawar), known for their valor and resistance to foreign invasions.' },
  ],
}

export async function fetchHeritageIcons(city) {
  const key = city.trim().toLowerCase()
  if (CITY_ICONS[key]) return CITY_ICONS[key]
  const aiIcons = await discoverHeritageSites(city, 'icons')
  if (aiIcons.length > 0) return aiIcons
  return await searchWikipedia(`${city} history famous people`, 4)
}

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
