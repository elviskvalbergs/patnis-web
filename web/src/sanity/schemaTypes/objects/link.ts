import {defineField, defineType} from 'sanity'

// One link type for menus, buttons and cards. Resolution order: internal > file > href.
export const link = defineType({
  name: 'link',
  title: 'Saite',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Teksts', type: 'string'}),
    defineField({
      name: 'internal',
      title: 'Iekšēja lapa',
      type: 'reference',
      to: [{type: 'page'}, {type: 'article'}, {type: 'branch'}],
    }),
    defineField({name: 'file', title: 'Fails', type: 'file'}),
    defineField({
      name: 'href',
      title: 'Ārēja saite (URL)',
      type: 'url',
      validation: (r) => r.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({name: 'children', title: 'Apakšpunkti', type: 'array', of: [{type: 'navItem'}]}),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

// Navigation item without nested children, to keep menus two levels deep.
export const navItem = defineType({
  name: 'navItem',
  title: 'Izvēlnes punkts',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Teksts', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'internal', title: 'Iekšēja lapa', type: 'reference', to: [{type: 'page'}, {type: 'article'}, {type: 'branch'}]}),
    defineField({name: 'href', title: 'Ārēja saite (URL)', type: 'url', validation: (r) => r.uri({allowRelative: true})}),
  ],
})
