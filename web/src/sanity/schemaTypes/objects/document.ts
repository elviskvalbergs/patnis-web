import {defineField, defineType} from 'sanity'

// A downloadable document: an uploaded file OR a link to another source.
export const downloadItem = defineType({
  name: 'downloadItem',
  title: 'Dokuments',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Nosaukums', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'file', title: 'Fails', type: 'file'}),
    defineField({
      name: 'url',
      title: 'Vai saite uz citu avotu',
      type: 'url',
      hidden: ({parent}) => Boolean(parent?.file),
    }),
  ],
  validation: (r) =>
    r.custom((v: {file?: unknown; url?: string} | undefined) =>
      v?.file || v?.url ? true : 'Pievieno failu vai saiti',
    ),
  preview: {select: {title: 'title', file: 'file.asset.originalFilename', url: 'url'}, prepare: ({title, file, url}) => ({title, subtitle: file || url})},
})
