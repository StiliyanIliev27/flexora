#!/usr/bin/env node

/**
 * Translation Utilities for Flexora
 * 
 * Usage:
 *   node scripts/translation-utils.js check          # Check for missing translations
 *   node scripts/translation-utils.js add-lang es   # Add new language (Spanish example)
 *   node scripts/translation-utils.js validate      # Validate translation files
 */

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../src/locales')
const LANGUAGES = ['en', 'bg'] // Add new languages here

// Get all module files from English (base language)
function getModuleFiles() {
  const enDir = path.join(LOCALES_DIR, 'en')
  return fs.readdirSync(enDir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace('.ts', ''))
}

// Check for missing translations
function checkMissingTranslations() {
  const modules = getModuleFiles()
  const issues = []

  LANGUAGES.slice(1).forEach(lang => { // Skip 'en' (base language)
    const langDir = path.join(LOCALES_DIR, lang)
    
    if (!fs.existsSync(langDir)) {
      issues.push(`❌ Missing language directory: ${lang}`)
      return
    }

    modules.forEach(module => {
      const moduleFile = path.join(langDir, `${module}.ts`)
      if (!fs.existsSync(moduleFile)) {
        issues.push(`❌ Missing translation file: ${lang}/${module}.ts`)
      }
    })
  })

  if (issues.length === 0) {
    console.log('✅ All translations are complete!')
  } else {
    console.log('Translation Issues:')
    issues.forEach(issue => console.log(issue))
  }

  return issues.length === 0
}

// Add new language
function addLanguage(langCode) {
  if (!langCode) {
    console.log('❌ Please provide a language code (e.g., es, fr, de)')
    return
  }

  const langDir = path.join(LOCALES_DIR, langCode)
  
  if (fs.existsSync(langDir)) {
    console.log(`❌ Language ${langCode} already exists`)
    return
  }

  // Create language directory
  fs.mkdirSync(langDir, { recursive: true })
  
  // Copy all module files from English
  const modules = getModuleFiles()
  
  modules.forEach(module => {
    const enFile = path.join(LOCALES_DIR, 'en', `${module}.ts`)
    const langFile = path.join(langDir, `${module}.ts`)
    
    // Read English file and create template
    const content = fs.readFileSync(enFile, 'utf8')
    const template = content.replace(/export const \w+ = {/, `export const ${module} = {\n  // TODO: Translate to ${langCode.toUpperCase()}`)
    
    fs.writeFileSync(langFile, template)
  })

  // Create index file
  const indexContent = `import { common } from './common'
import { navigation } from './navigation'
import { auth } from './auth'
import { dashboard } from './dashboard'
import { profile } from './profile'
import { exercises } from './exercises'

export const ${langCode} = {
  // TODO: Translate all sections to ${langCode.toUpperCase()}
  common,
  nav: navigation,
  auth,
  dashboard,
  profile,
  exercises,
  
  // Keep existing structure for now
  fitnessGoals: {
    weightLoss: 'TODO: Translate',
    muscleGain: 'TODO: Translate',
    // ... add all other translations
  },

  equipmentCategories: {
    bodyweight: 'TODO: Translate',
    // ... add all other translations
  },

  muscleGroups: {
    chest: 'TODO: Translate',
    // ... add all other translations
  },
} as const`

  fs.writeFileSync(path.join(langDir, 'index.ts'), indexContent)

  console.log(`✅ Created new language: ${langCode}`)
  console.log(`📁 Files created in: src/locales/${langCode}/`)
  console.log(`⚠️  Don't forget to:`)
  console.log(`   1. Add '${langCode}' to translations in src/locales/index.ts`)
  console.log(`   2. Update the database languages table`)
  console.log(`   3. Add flag icon for ${langCode}`)
}

// Validate translation files
function validateTranslations() {
  console.log('🔍 Validating translation files...')
  
  try {
    // Try to import each language
    LANGUAGES.forEach(lang => {
      const langPath = path.join(LOCALES_DIR, lang)
      if (fs.existsSync(langPath)) {
        require(langPath)
        console.log(`✅ ${lang}: Valid`)
      }
    })
    
    console.log('✅ All translation files are valid!')
    return true
  } catch (error) {
    console.log('❌ Validation failed:', error.message)
    return false
  }
}

// Main CLI handler
function main() {
  const command = process.argv[2]
  const arg = process.argv[3]

  switch (command) {
    case 'check':
      checkMissingTranslations()
      break
    
    case 'add-lang':
      addLanguage(arg)
      break
    
    case 'validate':
      validateTranslations()
      break
    
    default:
      console.log(`
Translation Utilities for Flexora

Usage:
  node scripts/translation-utils.js check          # Check for missing translations
  node scripts/translation-utils.js add-lang es   # Add new language (Spanish example)
  node scripts/translation-utils.js validate      # Validate translation files

Available commands:
  check      - Check for missing translation files
  add-lang   - Add a new language
  validate   - Validate all translation files
      `)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  checkMissingTranslations,
  addLanguage,
  validateTranslations,
}
