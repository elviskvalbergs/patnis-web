import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Raksts',
  type: 'document',
  groups: [{name: 'content', title: 'Saturs', default: true}, {name: 'media', title: 'Pielikumi'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'title', title: 'Virsraksts', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Adrese', type: 'slug', group: 'content', options: {source: 'title', maxLength: 96}, description: 'Raksts būs /raksts/<adrese>', validation: (r) => r.required()}),
    defineField({name: 'publishedAt', title: 'Publicēšanas datums', type: 'date', group: 'content', initialValue: () => new Date().toISOString().slice(0, 10)}),
    defineField({name: 'categories', title: 'Kategorijas', type: 'array', group: 'content', of: [{type: 'reference', to: [{type: 'category'}]}]}),
    defineField({name: 'mainImage', title: 'Galvenais attēls', type: 'image', group: 'content', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternatīvais teksts', type: 'string'})]}),
    defineField({name: 'excerpt', title: 'Īss apraksts', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'body', title: 'Saturs', type: 'richText', group: 'content'}),
    defineField({name: 'externalLink', title: 'Saite uz avotu', type: 'url', group: 'media', description: 'Piem. publikācija medijos'}),
    defineField({name: 'video', title: 'Video fails', type: 'file', group: 'media', options: {accept: 'video/*'}}),
    defineField({name: 'documents', title: 'Dokumenti', type: 'array', group: 'media', of: [{type: 'downloadItem'}]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Jaunākie', name: 'dateDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', date: 'publishedAt', media: 'mainImage'}, prepare: ({title, date, media}) => ({title, subtitle: date, media})},
})
