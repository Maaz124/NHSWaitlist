import { Globe, Check } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useEffect, useState } from "react";

type Language = "en" | "ar";

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  useEffect(() => {
    // Check if Google Translate has already changed the language
    const checkLanguage = () => {
      const cookie = document.cookie.match(/googtrans=([^;]+)/);
      if (cookie) {
        const lang = cookie[1].split("/").pop();
        if (lang === "ar") {
          setCurrentLanguage("ar");
        } else {
          setCurrentLanguage("en");
        }
      }
    };

    checkLanguage();
    // Check periodically in case language changes externally
    const interval = setInterval(checkLanguage, 1000);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lang: Language) => {
    const triggerTranslation = (targetLang: string) => {
      const selectElement = document.querySelector<HTMLSelectElement>(
        ".goog-te-combo"
      );
      if (selectElement && selectElement.options.length > 0) {
        selectElement.value = targetLang;
        const changeEvent = new Event("change", { bubbles: true });
        selectElement.dispatchEvent(changeEvent);
        return true;
      }
      return false;
    };

    if (lang === "ar") {
      // Try to trigger Arabic translation
      if (!triggerTranslation("ar")) {
        // Fallback: directly set cookie and reload
        document.cookie = "googtrans=/en/ar; path=/; max-age=31536000";
        window.location.reload();
        return;
      }
      setCurrentLanguage("ar");
    } else {
      // Revert to English
      if (!triggerTranslation("")) {
        // Fallback: remove translation cookie and reload
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        window.location.reload();
        return;
      }
      setCurrentLanguage("en");
    }
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
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          aria-label="Select language"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
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

