import {defineArrayMember, defineField, defineType} from 'sanity'

const heading = defineField({name: 'heading', title: 'Virsraksts', type: 'string'})

export const hero = defineType({
  name: 'hero',
  title: 'Galvenais baneris',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Virsraksts', type: 'string'}),
    defineField({name: 'subtitle', title: 'Apakšvirsraksts', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Attēls', type: 'image', options: {hotspot: true}}),
    defineField({name: 'buttons', title: 'Pogas', type: 'array', of: [{type: 'link'}]}),
  ],
  preview: {select: {title: 'title', media: 'image'}, prepare: ({title, media}) => ({title: title || 'Baneris', subtitle: 'Baneris', media})},
})

export const textSection = defineType({
  name: 'textSection',
  title: 'Teksts',
  type: 'object',
  fields: [heading, defineField({name: 'body', title: 'Saturs', type: 'richText'})],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Teksts', subtitle: 'Teksta bloks'})},
})

export const card = defineType({
  name: 'card',
  title: 'Kartīte',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Attēls', type: 'image', options: {hotspot: true}}),
    defineField({name: 'eyebrow', title: 'Birka', type: 'string', description: 'Piem. "Jaunums"'}),
    defineField({name: 'title', title: 'Virsraksts', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Teksts', type: 'text', rows: 3}),
    defineField({name: 'link', title: 'Saite', type: 'link'}),
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow', media: 'image'}},
})

export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Kartīšu režģis',
  type: 'object',
  fields: [heading, defineField({name: 'cards', title: 'Kartītes', type: 'array', of: [{type: 'card'}]})],
  preview: {select: {title: 'heading', cards: 'cards'}, prepare: ({title, cards}) => ({title: title || 'Kartītes', subtitle: `${cards?.length || 0} kartītes`})},
})

export const linkList = defineType({
  name: 'linkList',
  title: 'Saišu saraksts',
  type: 'object',
  fields: [heading, defineField({name: 'links', title: 'Saites', type: 'array', of: [{type: 'link'}]})],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Saites', subtitle: 'Saišu saraksts'})},
})

export const documentList = defineType({
  name: 'documentList',
  title: 'Dokumentu saraksts',
  type: 'object',
  fields: [heading, defineField({name: 'documents', title: 'Dokumenti', type: 'array', of: [{type: 'downloadItem'}]})],
  preview: {select: {title: 'heading', d: 'documents'}, prepare: ({title, d}) => ({title: title || 'Dokumenti', subtitle: `${d?.length || 0} dokumenti`})},
})

export const articleList = defineType({
  name: 'articleList',
  title: 'Rakstu saraksts',
  type: 'object',
  fields: [
    heading,
    defineField({name: 'category', title: 'Kategorija', type: 'reference', to: [{type: 'category'}], description: 'Tukšs = visi raksti'}),
    defineField({name: 'limit', title: 'Rakstu skaits lapā', type: 'number', initialValue: 20}),
    defineField({name: 'layout', title: 'Izskats', type: 'string', options: {list: [{title: 'Saraksts ar datumiem', value: 'list'}, {title: 'Kartītes', value: 'cards'}]}, initialValue: 'list'}),
  ],
  preview: {select: {title: 'heading', c: 'category.title'}, prepare: ({title, c}) => ({title: title || 'Raksti', subtitle: `Rakstu saraksts: ${c || 'visi'}`})},
})

export const branchList = defineType({
  name: 'branchList',
  title: 'Filiāļu saraksts',
  type: 'object',
  fields: [
    heading,
    defineField({name: 'division', title: 'Struktūrvienība', type: 'string', options: {list: ['pirmsskola', 'skola', 'makslu-skola']}}),
  ],
})

export const contacts = defineType({
  name: 'contacts',
  title: 'Kontaktpersonas',
  type: 'object',
  fields: [heading, defineField({name: 'people', title: 'Personas', type: 'array', of: [{type: 'reference', to: [{type: 'person'}]}]})],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Kontakti', subtitle: 'Kontaktpersonas'})},
})

export const pricing = defineType({
  name: 'pricing',
  title: 'Cenas',
  type: 'object',
  fields: [
    heading,
    defineField({
      name: 'rows',
      title: 'Rindas',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'priceRow',
        fields: [
          defineField({name: 'name', title: 'Programma', type: 'string'}),
          defineField({name: 'price', title: 'Cena', type: 'string'}),
          defineField({name: 'note', title: 'Piezīme', type: 'string'}),
        ],
        preview: {select: {title: 'name', subtitle: 'price'}},
      })],
    }),
    defineField({name: 'note', title: 'Piezīme zem tabulas', type: 'richText'}),
  ],
})

export const faq = defineType({
  name: 'faq',
  title: 'Jautājumi un atbildes',
  type: 'object',
  fields: [
    heading,
    defineField({
      name: 'items',
      title: 'Jautājumi',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'faqItem',
        fields: [
          defineField({name: 'question', title: 'Jautājums', type: 'string'}),
          defineField({name: 'answer', title: 'Atbilde', type: 'richText'}),
        ],
        preview: {select: {title: 'question'}},
      })],
    }),
  ],
})

export const cta = defineType({
  name: 'cta',
  title: 'Aicinājums (pogas)',
  type: 'object',
  fields: [
    heading,
    defineField({name: 'text', title: 'Teksts', type: 'text', rows: 3}),
    defineField({name: 'buttons', title: 'Pogas', type: 'array', of: [{type: 'link'}]}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Aicinājums', subtitle: 'Pogas'})},
})

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Galerijas',
  type: 'object',
  fields: [
    heading,
    defineField({name: 'galleries', title: 'Izvēlētās galerijas', type: 'array', of: [{type: 'reference', to: [{type: 'gallery'}]}], description: 'Tukšs = visas, jaunākās vispirms'}),
  ],
})

// A hand-coded page carried over 1:1 from Drupal: its own HTML and CSS, scoped under `scope`.
// Files the HTML references are uploaded as assets; `originalUrl` is swapped for the asset URL at render.
export const htmlBlock = defineType({
  name: 'htmlBlock',
  title: 'HTML bloks (no vecās lapas)',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Nosaukums', type: 'string', description: 'Tikai redaktoriem'}),
    defineField({name: 'html', title: 'HTML', type: 'text', rows: 20}),
    defineField({name: 'css', title: 'CSS', type: 'text', rows: 10}),
    defineField({name: 'js', title: 'JavaScript', type: 'text', rows: 6, description: 'Karuseles, izvēlnes u.c. no vecās lapas'}),
    defineField({name: 'scope', title: 'CSS tvērums', type: 'string', readOnly: true}),
    defineField({
      name: 'assets',
      title: 'Faili',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'htmlAsset',
        fields: [
          defineField({name: 'originalUrl', title: 'Vecā adrese', type: 'string'}),
          defineField({name: 'file', title: 'Fails', type: 'file'}),
        ],
        preview: {select: {title: 'originalUrl'}},
      })],
    }),
  ],
  preview: {select: {title: 'label'}, prepare: ({title}) => ({title: title || 'HTML bloks', subtitle: 'Pārnests no vecās lapas'})},
})

export const sectionTypes = [htmlBlock, hero, textSection, card, cardGrid, linkList, documentList, articleList, branchList, contacts, pricing, faq, cta, gallerySection]

// Order shown in the "add section" menu.
export const sectionMembers = ['htmlBlock', 'hero', 'textSection', 'cardGrid', 'linkList', 'documentList', 'articleList', 'branchList', 'contacts', 'pricing', 'faq', 'cta', 'gallerySection'].map((type) => ({type}))
