import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Kategorija',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nosaukums', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Atslēga', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
  ],
})
