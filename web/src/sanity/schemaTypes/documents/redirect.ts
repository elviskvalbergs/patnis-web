import {defineField, defineType} from 'sanity'

// Applied at build time (next.config.ts). Changing these needs a redeploy (deploy hook).
export const redirect = defineType({
  name: 'redirect',
  title: 'Pāradresācija',
  type: 'document',
  fields: [
    defineField({name: 'source', title: 'No (vecā adrese)', type: 'string', description: 'Piem. /vecā-lapa', validation: (r) => r.required().custom((v?: string) => (v?.startsWith('/') ? true : 'Jāsākas ar /'))}),
    defineField({name: 'destination', title: 'Uz', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'permanent', title: 'Pastāvīga (301)', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'source', subtitle: 'destination'}},
})
