import {defineArrayMember, defineField, defineType} from 'sanity'

// Body text used by articles, pages and text sections.
export const richText = defineType({
  name: 'richText',
  title: 'Teksts',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Parasts', value: 'normal'},
        {title: 'Virsraksts 2', value: 'h2'},
        {title: 'Virsraksts 3', value: 'h3'},
        {title: 'Virsraksts 4', value: 'h4'},
        {title: 'Citāts', value: 'blockquote'},
      ],
      lists: [
        {title: 'Saraksts', value: 'bullet'},
        {title: 'Numurēts', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Treknraksts', value: 'strong'},
          {title: 'Slīpraksts', value: 'em'},
          {title: 'Pasvītrots', value: 'underline'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Saite',
            type: 'object',
            fields: [
              defineField({name: 'href', title: 'URL', type: 'url', validation: (r) => r.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})}),
              defineField({name: 'blank', title: 'Atvērt jaunā cilnē', type: 'boolean'}),
            ],
          },
          {
            name: 'internalLink',
            title: 'Iekšēja saite',
            type: 'object',
            fields: [defineField({name: 'reference', type: 'reference', to: [{type: 'page'}, {type: 'article'}, {type: 'branch'}]})],
          },
          {
            name: 'fileLink',
            title: 'Saite uz failu',
            type: 'object',
            fields: [defineField({name: 'file', title: 'Fails', type: 'file'})],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alternatīvais teksts', type: 'string'}),
        defineField({name: 'caption', title: 'Paraksts', type: 'string'}),
      ],
    }),
    defineArrayMember({
      name: 'videoFile',
      title: 'Video fails',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineArrayMember({
      name: 'embed',
      title: 'Iegult (YouTube, Vimeo, Facebook)',
      type: 'object',
      fields: [defineField({name: 'url', title: 'URL', type: 'url', validation: (r) => r.required()})],
      preview: {select: {title: 'url'}},
    }),
  ],
})
