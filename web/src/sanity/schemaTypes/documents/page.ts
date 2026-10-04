import {defineField, defineType, type SlugRule} from 'sanity'
import {sectionMembers} from '../sections'

// Full URL path without leading slash, e.g. "skola/steam". Lowercase ASCII only.
export const pathValidation = (r: SlugRule) =>
  r.required().custom((v) =>
    !v?.current || /^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(v.current) ? true : 'Tikai a-z, 0-9, "-" un "/" (bez garumzīmēm)',
  )

export const page = defineType({
  name: 'page',
  title: 'Lapa',
  type: 'document',
  groups: [{name: 'content', title: 'Saturs', default: true}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'title', title: 'Nosaukums', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Adrese',
      type: 'slug',
      group: 'content',
      description: 'Pilns ceļš bez sākuma "/", piem. skola/steam',
      validation: pathValidation,
    }),
    defineField({name: 'intro', title: 'Ievads', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'sections', title: 'Sadaļas', type: 'array', of: sectionMembers, group: 'content'}),
    defineField({
      name: 'migrationNote',
      title: 'Migrācijas piezīme',
      type: 'text',
      rows: 2,
      group: 'content',
      readOnly: true,
      hidden: ({value}) => !value,
      description: 'Automātiski importēts no vecās lapas. Pārbaudi izkārtojumu un izdzēs piezīmi.',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}, prepare: ({title, subtitle}) => ({title, subtitle: '/' + (subtitle || '')})},
})
