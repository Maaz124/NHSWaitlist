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
          // User wants English - ensure cookie is cleared
          const cookie = document.cookie.match(/googtrans=([^;]+)/);
          if (cookie && cookie[1].includes("ar")) {
            // Cookie was changed back to Arabic against user's will - clear it
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
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
            document.cookie = "googtrans=/en/ar; path=/; max-age=31536000; SameSite=Lax";
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

    return () => clearInterval(cookieCheckInterval);
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
      // Set cookie first
      if (cookieValue) {
        document.cookie = cookieValue;
      } else {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
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
      applyLanguageChange("ar", "googtrans=/en/ar; path=/; max-age=31536000; SameSite=Lax");
    } else {
      applyLanguageChange("en", "");
    }

    // Keep the manual change flag active longer to ensure user's choice is respected
    setTimeout(() => {
      manualChangeRef.current = false;
      lastManualLanguageRef.current = null;
    }, 10000);
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

