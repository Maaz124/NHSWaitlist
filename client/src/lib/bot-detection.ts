/**
 * Detects if the current request is from a search engine crawler or bot
 * This allows us to serve SEO-friendly static content to search engines
 * while maintaining authentication checks for regular users
 */
export function isSearchEngineBot(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // List of search engine bot user agents
  const botPatterns = [
    // Google
    'googlebot',
    'google-inspectiontool',
    'apis-google',
    'mediapartners-google',
    'adsbot-google',
    
    // Bing
    'bingbot',
    'bingpreview',
    'msnbot',
    
    // Other search engines
    'slurp',           // Yahoo
    'duckduckbot',     // DuckDuckGo
    'baiduspider',     // Baidu
    'yandexbot',       // Yandex
    'sogou',           // Sogou
    'exabot',          // Exalead
    'facebookexternalhit', // Facebook
    'facebookcatalog', // Facebook Catalog
    'twitterbot',      // Twitter
    'rogerbot',        // Moz
    'linkedinbot',     // LinkedIn
    'embedly',         // Embedly
    'quora link preview',
    'showyoubot',      // ShowYou
    'outbrain',        // Outbrain
    'pinterest',       // Pinterest
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkShare',
    'W3C_Validator',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'qwantify',
    'pinterestbot',
    'bitrix link preview',
    'xing-contenttabreceiver',
    'chrome-lighthouse',
    'applebot',
    'petalbot',        // Petal Search
    
    // SEO Tools
    'ahrefsbot',
    'semrushbot',
    'dotbot',
    'mj12bot',
    'megaindex',
    'dotbot',
    
    // Generic bot indicators
    'bot',
    'crawler',
    'spider',
    'scraper',
  ];

  // Check if user agent matches any bot pattern
  const isBot = botPatterns.some(pattern => userAgent.includes(pattern));

  // Additional check: if there's no window or document interaction capabilities,
  // it's likely a bot (bots typically don't execute JavaScript that interacts with DOM)
  // However, modern bots can execute JS, so we mainly rely on user agent

  return isBot;
}

/**
 * Check if the request is from a known search engine crawler
 * More specific than isSearchEngineBot - only returns true for major search engines
 */
export function isMajorSearchEngineBot(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  const majorSearchEngines = [
    'googlebot',
    'bingbot',
    'slurp',           // Yahoo
    'duckduckbot',     // DuckDuckGo
    'baiduspider',     // Baidu
    'yandexbot',       // Yandex
    'applebot',        // Apple
  ];

  return majorSearchEngines.some(engine => userAgent.includes(engine));
}

