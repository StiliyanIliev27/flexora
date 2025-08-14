"use client"

import React, { useState } from 'react'
import { Search, Filter, Plus, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useExercises } from '@/hooks/useExercises'
import { useLanguage } from '@/contexts/LanguageContext'
import { ExerciseCard } from './ExerciseCard'
import { ExerciseFilters } from './ExerciseFilters'
import { ExerciseModal } from './ExerciseModal'
import { CreateExerciseModal } from './CreateExerciseModal'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import type { ExerciseWithDetails } from '@/types/profile.types'

export function ExerciseLibrary() {
  const { t } = useLanguage()
  const {
    searchResults,
    equipment,
    muscleGroups,
    loading,
    error,
    updateFilters,
    clearFilters,
    searchExercises,
    loadNextPage,
    loadPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = useExercises()

  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithDetails | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    searchExercises(value)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    clearFilters()
  }

  if (loading && searchResults.exercises.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3">{t('exercises.loadingExercises')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('exercises.title')}</h1>
          <p className="text-muted-foreground">
            {searchResults.total} {t('exercises.title').toLowerCase()} {t('common.found')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('exercises.createCustom')}
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('exercises.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('exercises.filters')}
                {Object.keys(searchResults.filters).length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {Object.values(searchResults.filters).filter(v => 
                      Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
                    ).length}
                  </Badge>
                )}
              </Button>

              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.keys(searchResults.filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {searchResults.filters.difficulty && searchResults.filters.difficulty.length > 0 && (
                <Badge variant="outline">
                  {t('exercises.difficulty')}: {searchResults.filters.difficulty.join(', ')}
                </Badge>
              )}
              {searchResults.filters.muscle_groups && searchResults.filters.muscle_groups.length > 0 && (
                <Badge variant="outline">
                  {t('exercises.muscleGroups')}: {searchResults.filters.muscle_groups.length} {t('common.selected')}
                </Badge>
              )}
              {searchResults.filters.equipment && searchResults.filters.equipment.length > 0 && (
                <Badge variant="outline">
                  {t('exercises.equipment')}: {searchResults.filters.equipment.length} {t('common.selected')}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2"
              >
                {t('exercises.clearFilters')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <ExerciseFilters
          equipment={equipment}
          muscleGroups={muscleGroups}
          filters={searchResults.filters}
          onFiltersChange={updateFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      {searchResults.exercises.length === 0 && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>{t('exercises.noExercisesFound')}</p>
              {Object.keys(searchResults.filters).length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  {t('exercises.clearFilters')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {searchResults.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              viewMode={viewMode}
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {searchResults.total > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {t('common.showing')} {(searchResults.page - 1) * searchResults.limit + 1} - {Math.min(searchResults.page * searchResults.limit, searchResults.total)} {t('common.of')} {searchResults.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPreviousPage}
              disabled={!hasPreviousPage || loading}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadNextPage}
              disabled={!hasNextPage || loading}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && searchResults.exercises.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <CreateExerciseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          equipment={equipment}
          muscleGroups={muscleGroups}
        />
      )}
    </div>
  )
}

