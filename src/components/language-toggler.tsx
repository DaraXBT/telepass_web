"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useLanguage} from "./providers/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Check} from "lucide-react";

export function LanguageToggler() {
  const {language, setLanguage} = useLanguage();

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "/flags/uk.svg",
    },
    {
      code: "km",
      name: "ភាសាខ្មែរ", // Khmer 
      flag: "/flags/kh.svg",
    },
  ];

  const handleLanguageChange = (langCode: "en" | "km") => {
    setLanguage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Image
            src={currentLanguage?.flag || "/flags/uk.svg"}
            alt={currentLanguage?.name || "English"}
            width={20}
            height={20}
            className="h-[1.2rem] w-[1.2rem] rounded-sm"
          />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as "en" | "km")}
            className={`flex items-center gap-2 ${lang.code === "km" ? "font-kantumruy" : ""}`}
          >
            <Image
              src={lang.flag}
              alt={lang.name}
              width={20}
              height={20}
              className="h-[1.2rem] w-[1.2rem] rounded-sm"
            />
            <span className={lang.code === "km" ? "font-kantumruy" : ""}>{lang.name}</span>
            {language === lang.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
