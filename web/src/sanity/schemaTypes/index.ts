import {article} from './documents/article'
import {branch} from './documents/branch'
import {category} from './documents/category'
import {gallery} from './documents/gallery'
import {page} from './documents/page'
import {person} from './documents/person'
import {redirect} from './documents/redirect'
import {siteSettings} from './documents/siteSettings'
import {downloadItem} from './objects/document'
import {link, navItem} from './objects/link'
import {richText} from './objects/richText'
import {seo} from './objects/seo'
import {sectionTypes} from './sections'

export const schemaTypes = [
  siteSettings, page, article, category, branch, person, gallery, redirect,
  link, navItem, downloadItem, richText, seo,
  ...sectionTypes,
]
