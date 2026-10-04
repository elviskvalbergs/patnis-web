import type {StructureResolver} from 'sanity/structure'

// Settings is a singleton; everything else is a normal list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Saturs')
    .items([
      S.listItem().title('Vietnes iestatījumi').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('page').title('Lapas'),
      S.documentTypeListItem('article').title('Raksti'),
      S.documentTypeListItem('category').title('Kategorijas'),
      S.documentTypeListItem('branch').title('Filiāles'),
      S.documentTypeListItem('person').title('Darbinieki'),
      S.documentTypeListItem('gallery').title('Galerijas'),
      S.divider(),
      S.documentTypeListItem('redirect').title('Pāradresācijas'),
    ])
