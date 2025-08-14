"use client"

import * as React from "react"
import { Moon, Sun, Bell, Globe, Settings } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"
import { useLanguages } from "@/hooks/useLanguages"
import type { LanguageOption } from "@/types/language.types"
import Image from "next/image"

interface HeaderControlsProps {
  hasNotifications?: boolean
}

export function HeaderControls({ hasNotifications = false }: HeaderControlsProps) {
  const { theme, setTheme } = useTheme()
  const { currentLanguage, changeLanguage, isLoading: languagesLoading, t } = useLanguage()
  const { languages } = useLanguages() // Still need this for the dropdown options

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLanguageChange = async (language: LanguageOption) => {
    try {
      await changeLanguage(language)
      // Success feedback could be added here if needed
    } catch (error) {
      console.error('Failed to change language:', error)
      // Error feedback could be added here if needed
    }
  }

  // Show loading state or fallback if languages haven't loaded
  if (languagesLoading || !currentLanguage) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="h-8 w-12 bg-muted rounded animate-pulse" />
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 min-w-[3rem]">
            {currentLanguage.flagIcon ? (
              <Image 
                src={currentLanguage.flagIcon} 
                alt={`${currentLanguage.name} flag`}
                className="w-4 h-3 object-cover rounded-sm"
                width={16}
                height={12}
                style={{ width: 'auto', height: 'auto' }}
              />
            ) : (
              <div className="w-4 h-3 bg-muted rounded-sm" />
            )}
            <span className="text-xs font-medium hidden sm:block">
              {currentLanguage.code.toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('auth.chooseLanguage')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="gap-3 p-3"
            >
              {language.flagIcon ? (
                <Image 
                  src={language.flagIcon} 
                  alt={`${language.name} flag`}
                  className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                  width={24}
                  height={16}
                  style={{ width: 'auto', height: 'auto' }}
                />
              ) : (
                <div className="w-6 h-4 bg-muted rounded-sm flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-muted-foreground">
                  {language.nativeName}
                </span>
              </div>
              {language.code === currentLanguage.code && (
                <div className="ml-auto size-2 rounded-full bg-emerald-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 relative"
      >
        <Bell className="h-4 w-4" />
        {hasNotifications && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>
  )
}