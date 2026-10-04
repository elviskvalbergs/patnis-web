import {defineField, defineType} from 'sanity'
import {pathValidation} from './page'
import {sectionMembers} from '../sections'

// Filiāle: a preschool / school location with address and contacts.
export const branch = defineType({
  name: 'branch',
  title: 'Filiāle',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nosaukums', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Adrese (URL)', type: 'slug', description: 'Piem. pirmsskola/maldugunu-iela', validation: pathValidation}),
    defineField({name: 'division', title: 'Struktūrvienība', type: 'string', options: {list: ['pirmsskola', 'skola', 'makslu-skola']}}),
    defineField({name: 'image', title: 'Attēls', type: 'image', options: {hotspot: true}}),
    defineField({name: 'address', title: 'Adrese', type: 'string'}),
    defineField({name: 'summary', title: 'Īss apraksts', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Apraksts', type: 'richText'}),
    defineField({name: 'contacts', title: 'Kontaktpersonas', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]}),
    defineField({name: 'documents', title: 'Dokumenti', type: 'array', of: [{type: 'downloadItem'}]}),
    defineField({name: 'facebookUrl', title: 'Facebook lapa', type: 'url'}),
    defineField({name: 'sections', title: 'Papildu sadaļas', type: 'array', of: sectionMembers}),
    defineField({name: 'order', title: 'Secība', type: 'number'}),
    defineField({name: 'migrationNote', title: 'Migrācijas piezīme', type: 'text', rows: 2, readOnly: true, hidden: ({value}) => !value}),
  ],
  preview: {select: {title: 'name', subtitle: 'division', media: 'image'}},
})
