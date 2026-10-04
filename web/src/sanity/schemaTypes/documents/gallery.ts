import {defineField, defineType} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galerija',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nosaukums', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'date', title: 'Datums', type: 'date'}),
    defineField({name: 'images', title: 'Attēli', type: 'array', of: [{type: 'image', options: {hotspot: true}}], options: {layout: 'grid'}}),
  ],
  orderings: [{title: 'Jaunākās', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'images.0'}},
})
