import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', title: 'Meta virsraksts', type: 'string', validation: (r) => r.max(70)}),
    defineField({name: 'description', title: 'Meta apraksts', type: 'text', rows: 3, validation: (r) => r.max(170)}),
    defineField({name: 'image', title: 'Kopīgošanas attēls', type: 'image'}),
    defineField({name: 'noIndex', title: 'Slēpt no meklētājiem', type: 'boolean', initialValue: false}),
  ],
})
