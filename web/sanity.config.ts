'use client'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const singletons = new Set(['siteSettings'])

export default defineConfig({
  basePath: '/studio',
  title: 'Patnis',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletons.has(schemaType)),
  },
  document: {
    actions: (input, {schemaType}) =>
      singletons.has(schemaType) ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : input,
  },
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
})
