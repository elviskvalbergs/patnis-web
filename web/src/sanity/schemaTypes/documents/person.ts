import {defineField, defineType} from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'Darbinieks',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Vārds, uzvārds', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Amats', type: 'string'}),
    defineField({name: 'email', title: 'E-pasts', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'phone', title: 'Tālrunis', type: 'string'}),
    defineField({name: 'address', title: 'Adrese', type: 'string'}),
    defineField({name: 'photo', title: 'Foto', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
