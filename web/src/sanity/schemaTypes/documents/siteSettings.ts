import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Vietnes iestatījumi',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Vietnes nosaukums', type: 'string'}),
    defineField({name: 'tagline', title: 'Sauklis', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'homePage', title: 'Sākumlapa', type: 'reference', to: [{type: 'page'}]}),
    defineField({name: 'mainNav', title: 'Galvenā izvēlne', type: 'array', of: [{type: 'link'}]}),
    defineField({name: 'footerLinks', title: 'Kājenes saites', type: 'array', of: [{type: 'link'}]}),
    defineField({
      name: 'social',
      title: 'Sociālie tīkli',
      type: 'array',
      of: [{type: 'object', name: 'socialLink', fields: [
        defineField({name: 'platform', title: 'Platforma', type: 'string'}),
        defineField({name: 'url', title: 'URL', type: 'url'}),
      ], preview: {select: {title: 'platform', subtitle: 'url'}}}],
    }),
    defineField({name: 'contactEmail', title: 'E-pasts', type: 'string'}),
    defineField({name: 'contactPhone', title: 'Tālrunis', type: 'string'}),
    defineField({name: 'copyright', title: 'Autortiesību teksts', type: 'string'}),
    defineField({name: 'portalUrl', title: 'Klientu portāla adrese', type: 'url', description: 'Pieteikšanās formas ved uz portālu'}),
    defineField({name: 'seo', title: 'Noklusējuma SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Vietnes iestatījumi'})},
})
