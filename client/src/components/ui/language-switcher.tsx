import { Globe, Check } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useEffect, useState, useRef } from "react";

type Language = "en" | "ar";

interface LanguageSwitcherProps {
  fullWidth?: boolean;
}

export function LanguageSwitcher({ fullWidth = false }: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const manualChangeRef = useRef(false);
  const lastManualLanguageRef = useRef<Language | null>(null);
  const cookieBlockerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Comprehensive cookie clearing function (similar to index.html)
  const clearGoogleTranslateCookies = () => {
    const paths = ['/', '/en', '', '/index.html'];
    const hostname = window.location.hostname;
    const domains = [
      '',  // No domain (default)
      hostname,  // Exact hostname
      '.' + hostname,  // With dot prefix
      hostname.split('.').slice(-2).join('.'),  // Parent domain if subdomain
      '.' + hostname.split('.').slice(-2).join('.')  // Parent with dot
    ];
    
    // Remove duplicates
    const uniqueDomains = domains.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
    
    // Clear from all path, domain, and security combinations
    for (let i = 0; i < paths.length; i++) {
      for (let j = 0; j < uniqueDomains.length; j++) {
        const domainStr = uniqueDomains[j] ? 'domain=' + uniqueDomains[j] + ';' : '';
        const pathStr = paths[i] ? 'path=' + paths[i] + ';' : '';
        
        // Clear without secure flag
        document.cookie = 'googtrans=;' + expires + domainStr + pathStr + 'SameSite=Lax;';
        document.cookie = 'googtrans=;' + expires + domainStr + pathStr + 'SameSite=Strict;';
        document.cookie = 'googtrans=;' + expires + domainStr + pathStr + 'SameSite=None;';
        
        // Clear with secure flag (for HTTPS)
        if (secureFlag) {
          document.cookie = 'googtrans=;' + expires + domainStr + pathStr + secureFlag + 'SameSite=Lax;';
          document.cookie = 'googtrans=;' + expires + domainStr + pathStr + secureFlag + 'SameSite=Strict;';
          document.cookie = 'googtrans=;' + expires + domainStr + pathStr + secureFlag + 'SameSite=None;';
        }
        
        // Also try clearing with different cookie names Google might use
        document.cookie = 'googtrans=/en/ar;' + expires + domainStr + pathStr + 'SameSite=Lax;';
        document.cookie = 'googtrans=/ar;' + expires + domainStr + pathStr + 'SameSite=Lax;';
      }
    }
    
    // Also clear localStorage and sessionStorage if Google Translate uses them
    try {
      const keysToRemove = ['googtrans', 'google_translate_lang', 'gt_lang'];
      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
          // Clear all localStorage items that start with 'goog'
          for (let k = 0; k < localStorage.length; k++) {
            const storageKey = localStorage.key(k);
            if (storageKey && storageKey.toLowerCase().indexOf('goog') >= 0) {
              localStorage.removeItem(storageKey);
            }
          }
        } catch(e) {}
      });
    } catch(e) {}
    
    // Set default to English with proper attributes
    const cookieSettings = 'path=/; max-age=86400; SameSite=Lax;' + (window.location.protocol === 'https:' ? ' Secure;' : '');
    document.cookie = 'googtrans=/en/en;' + cookieSettings;
  };

  const setEnglishCookie = () => {
    const cookieSettings = 'path=/; max-age=86400; SameSite=Lax;' + (window.location.protocol === 'https:' ? ' Secure;' : '');
    document.cookie = 'googtrans=/en/en;' + cookieSettings;
  };

  useEffect(() => {
    // Check if Google Translate has already changed the language on mount
    const checkLanguage = () => {
      // Don't override if user just manually changed the language
      if (manualChangeRef.current) {
        return;
      }

      const cookie = document.cookie.match(/googtrans=([^;]+)/);
      if (cookie) {
        const lang = cookie[1].split("/").pop();
        if (lang === "ar") {
          setCurrentLanguage("ar");
        } else {
          setCurrentLanguage("en");
        }
      } else {
        // No cookie means English (original language)
        setCurrentLanguage("en");
      }
    };

    // Check on mount
    checkLanguage();

    // Monitor cookie changes to prevent unwanted overrides
    let lastCookieValue = document.cookie.match(/googtrans=([^;]+)/)?.[1] || "";
    const cookieCheckInterval = setInterval(() => {
      if (manualChangeRef.current) {
        // User manually changed language - enforce their choice
        const expectedLang = lastManualLanguageRef.current;
        if (expectedLang === "en") {
          // User wants English - ensure cookie is cleared using comprehensive method
          const cookie = document.cookie.match(/googtrans=([^;]+)/);
          if (cookie && cookie[1].includes("ar")) {
            // Cookie was changed back to Arabic against user's will - clear it comprehensively
            clearGoogleTranslateCookies();
            // Trigger English translation again
            const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
            if (selectElement && selectElement.options.length > 0) {
              for (let i = 0; i < selectElement.options.length; i++) {
                const opt = selectElement.options[i];
                if (i === 0 || opt.value === "" || opt.value === "en" || opt.text.toLowerCase().includes("english")) {
                  selectElement.value = opt.value;
                  const changeEvent = new Event("change", { bubbles: true });
                  selectElement.dispatchEvent(changeEvent);
                  break;
                }
              }
            }
          }
        } else if (expectedLang === "ar") {
          // User wants Arabic - ensure cookie is set
          const cookie = document.cookie.match(/googtrans=([^;]+)/);
          if (!cookie || !cookie[1].includes("ar")) {
            // Cookie was cleared against user's will - set it back
            document.cookie = "googtrans=/en/ar; path=/; max-age=31536000; SameSite=Lax" + (window.location.protocol === 'https:' ? '; Secure' : '');
          }
        }
      }
      
      // Update last known cookie value
      const currentCookie = document.cookie.match(/googtrans=([^;]+)/)?.[1] || "";
      if (currentCookie !== lastCookieValue && !manualChangeRef.current) {
        lastCookieValue = currentCookie;
        checkLanguage();
      }
    }, 500);

    return () => {
      clearInterval(cookieCheckInterval);
      if (cookieBlockerIntervalRef.current) {
        clearInterval(cookieBlockerIntervalRef.current);
      }
    };
  }, []);

  const changeLanguage = (lang: Language) => {
    // Mark that this is a manual change to prevent auto-sync from overriding
    manualChangeRef.current = true;
    lastManualLanguageRef.current = lang;
    
    // Update state immediately for responsive UI
    setCurrentLanguage(lang);

    // Wait for Google Translate to be ready and trigger translation
    const waitForGoogleTranslate = (callback: () => void, maxAttempts = 20) => {
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (selectElement && selectElement.options.length > 0) {
          clearInterval(checkInterval);
          callback();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          // If Google Translate isn't ready, reload the page with the correct cookie
          console.warn("Google Translate not ready, reloading page");
          window.location.reload();
        }
      }, 100);
    };

    const triggerTranslation = (targetLang: string): boolean => {
      // Method 1: Try using Google Translate API directly if available
      try {
        if (typeof (window as any).google !== 'undefined' && 
            (window as any).google.translate &&
            (window as any).google.translate.TranslateElement) {
          // Google Translate API is available
          // Try to find and trigger the select element
        }
      } catch (e) {
        console.log("Google Translate API not accessible:", e);
      }

      // Method 2: Find and trigger the select element
      const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (!selectElement) {
        // Select element might be in an iframe, try to access it
        const iframe = document.querySelector<HTMLIFrameElement>(".goog-te-menu-frame");
        if (iframe && iframe.contentDocument) {
          const iframeSelect = iframe.contentDocument.querySelector<HTMLSelectElement>(".goog-te-combo");
          if (iframeSelect) {
            return triggerSelectChange(iframeSelect, targetLang);
          }
        }
        return false;
      }

      if (selectElement.options.length === 0) {
        return false;
      }

      return triggerSelectChange(selectElement, targetLang);
    };

    const triggerSelectChange = (selectElement: HTMLSelectElement, targetLang: string): boolean => {
      // Find the option value that matches our target language
      let optionValue: string | null = null;
      
      if (targetLang === "ar") {
        // Look for Arabic option
        for (let i = 0; i < selectElement.options.length; i++) {
          const opt = selectElement.options[i];
          if (opt.value === "ar" || opt.value.includes("ar")) {
            optionValue = opt.value;
            break;
          }
        }
      } else {
        // For English, find the option that represents original language
        // The first option is usually the default/original language
        optionValue = selectElement.options[0]?.value || "";
        
        // Also check for explicit English or original options
        for (let i = 0; i < selectElement.options.length; i++) {
          const opt = selectElement.options[i];
          const optText = opt.text.toLowerCase();
          if (opt.value === "" || 
              opt.value === "en" || 
              optText.includes("english") || 
              optText.includes("original") ||
              optText.includes("select")) {
            optionValue = opt.value;
            break;
          }
        }
      }
      
      if (optionValue === null) {
        return false;
      }

      // Store current value to check if it changes
      const oldValue = selectElement.value;
      
      // Set the value using multiple approaches
      selectElement.selectedIndex = -1; // Reset first
      
      // Find the index of the option with our value
      for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === optionValue) {
          selectElement.selectedIndex = i;
          break;
        }
      }
      
      // If that didn't work, set value directly
      if (selectElement.value !== optionValue) {
        selectElement.value = optionValue;
      }

      // Now trigger events in multiple ways to ensure Google Translate responds
      const events = [
        new Event("change", { bubbles: true, cancelable: true }),
        new Event("input", { bubbles: true, cancelable: true }),
      ];

      events.forEach(event => {
        selectElement.dispatchEvent(event);
      });

      // Try creating event the old way (for compatibility)
      try {
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
        selectElement.dispatchEvent(evt);
      } catch (e) {
        // Ignore if not supported
      }

      // Try using Object.defineProperty to trigger if value actually changed
      if (oldValue !== optionValue) {
        // Force a property change notification
        Object.defineProperty(selectElement, 'value', {
          value: optionValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
        
        // Dispatch change again after property change
        selectElement.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
      }

      // Return true if we set a value
      return selectElement.value === optionValue;
    };

    // Change language: Set cookie and attempt programmatic translation
    // If programmatic doesn't work quickly, reload page (cookie ensures correct language on reload)
    const applyLanguageChange = (targetLang: string, cookieValue: string) => {
      // Clear any existing cookie blocker
      if (cookieBlockerIntervalRef.current) {
        clearInterval(cookieBlockerIntervalRef.current);
        cookieBlockerIntervalRef.current = null;
      }

      // Set cookie first
      if (cookieValue) {
        document.cookie = cookieValue;
      } else {
        // For English, use comprehensive cookie clearing
        clearGoogleTranslateCookies();
      }

      // If switching to English, start a persistent cookie blocker
      if (targetLang === "en") {
        // Start aggressive cookie blocker that runs for 30 seconds
        cookieBlockerIntervalRef.current = setInterval(() => {
          const cookies = document.cookie.split(';');
          let hasArabicCookie = false;
          
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.indexOf('googtrans=') === 0) {
              const value = cookie.substring('googtrans='.length);
              if (value.indexOf('/ar') >= 0 || value.indexOf('/en/ar') >= 0) {
                hasArabicCookie = true;
                break;
              }
            }
          }
          
          // If Arabic cookie is detected, clear it immediately
          if (hasArabicCookie) {
            clearGoogleTranslateCookies();
            
            // Also ensure the select element is set to English
            const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
            if (selectElement && selectElement.options.length > 0) {
              // Find English option (usually first option)
              for (let i = 0; i < selectElement.options.length; i++) {
                const opt = selectElement.options[i];
                if (i === 0 || opt.value === "" || opt.value === "en" || opt.text.toLowerCase().includes("english")) {
                  if (selectElement.value !== opt.value) {
                    selectElement.value = opt.value;
                    selectElement.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                  break;
                }
              }
            }
          }
        }, 100); // Check every 100ms
        
        // Stop the blocker after 30 seconds
        setTimeout(() => {
          if (cookieBlockerIntervalRef.current) {
            clearInterval(cookieBlockerIntervalRef.current);
            cookieBlockerIntervalRef.current = null;
          }
        }, 30000);
      }

      // Try programmatic translation multiple times
      let attempts = 0;
      const maxAttempts = 5;
      const tryTranslate = () => {
        attempts++;
        const selectElement = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (selectElement && selectElement.options.length > 0) {
          triggerTranslation(targetLang);
        }
        
        if (attempts < maxAttempts) {
          setTimeout(tryTranslate, 100);
        }
      };

      // Start trying immediately
      tryTranslate();

      // Fallback: Reload after 400ms if programmatic translation didn't work
      // This ensures the language change always works via cookie + reload
      setTimeout(() => {
        window.location.reload();
      }, 400);
    };

    if (lang === "ar") {
      const cookieValue = "googtrans=/en/ar; path=/; max-age=31536000; SameSite=Lax" + (window.location.protocol === 'https:' ? '; Secure' : '');
      applyLanguageChange("ar", cookieValue);
    } else {
      applyLanguageChange("en", "");
    }

    // Keep the manual change flag active longer to ensure user's choice is respected
    setTimeout(() => {
      manualChangeRef.current = false;
      lastManualLanguageRef.current = null;
    }, 30000); // Extended to 30 seconds to match cookie blocker duration
  };

  // Wait for Google Translate to initialize and hide banners
  useEffect(() => {
    const hideGoogleTranslateUI = () => {
      // Hide the Google Translate banner if it appears
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) {
        (banner as HTMLElement).style.display = "none";
      }
      const topFrame = document.querySelector(".goog-te-balloon-frame");
      if (topFrame) {
        (topFrame as HTMLElement).style.display = "none";
      }
      // Ensure body doesn't get pushed down
      document.body.style.top = "0";
    };

    // Check immediately and then periodically
    hideGoogleTranslateUI();
    const interval = setInterval(hideGoogleTranslateUI, 500);
    
    // Also check after a delay to catch late initialization
    const timeout = setTimeout(hideGoogleTranslateUI, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 text-muted-foreground hover:text-foreground ${fullWidth ? 'w-full justify-start' : ''}`}
          aria-label="Select language"
        >
          <Globe className="w-4 h-4" />
          <span className="whitespace-nowrap">
            {currentLanguage === "en" ? "English" : "العربية"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="flex items-center justify-between"
        >
          <span>English</span>
          {currentLanguage === "en" && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className="flex items-center justify-between"
        >
          <span>العربية (Arabic)</span>
          {currentLanguage === "ar" && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

