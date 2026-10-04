# patnis.lv content inventory

Crawled 2026-10-04 from the live Drupal 10 site. Generated from `crawl/index.json` and `import/patnis.ndjson`.

## Summary

| What | Count | Sanity type |
|---|---|---|
| Articles (`/raksts/*`) | 153 | `article` |
| Pages | 50 | `page` (with sections) |
| Article categories (one per listing page) | 7 | `category` |
| Branches (preschool/school locations) | 5 | `branch` |
| Staff contacts | 3 | `person` |
| Photo galleries | 8 | `gallery` |
| Redirects (old → new paths, incl. /node/N) | 205 | `next.config.ts` + `redirect` docs |
| Files linked on the site | 793 (456 MB) | Sanity assets |

Files by type: jpg 379, jpeg 228, png 114, pdf 44, mp4 25, docx 2, pptx 1. Videos (mp4) are ~140 MB of the total; still far below the free plan's 100 GB storage.

## Drupal content types → Sanity

| Drupal | What it is | Sanity |
|---|---|---|
| `article` | News, blog posts, media publications, school-year reports | `article` + `category` refs |
| `page` | Plain text pages (FAQ, privacy, school sub-pages) | `page` with a text section |
| `landing-page` | Hand-coded HTML pasted into the body field (home, /pirmsskola, /ppms, /playlab, music…) | `page`; text, cards and documents extracted; **layout to be rebuilt** |
| `school` | Branch location with photo, address, contact person, documents | `branch` + `person` |
| Taxonomy `darbinieki` | Contact person (name, role, email, phone, address) | `person` |
| `webform` + `/form/*` | Application and contract forms (8) | `page` with a button to portal.patnis.lv. **Forms move to the portal** |
| Views (STEAM, VPD, Prese, Blogs, Cambridge, OECD, Atvērtās durvis) | Article listings | `page` with `articleList` section + `category` |
| Gallery view (`/skola/galerija`) | Albums with date and photos | `gallery` + `gallerySection` |
| Menus / footer blocks | Main menu (5), footer links (7), social (5) | `siteSettings` singleton |

## Forms (do not migrate to Sanity)

These collect personal data (personas kods, addresses, bank account), so they belong in portal.patnis.lv, not in a public Sanity dataset.

| Old path | Fields |
|---|---|
| `/pirmsskola/pieteiksanas` | Vārds, uzvārds*; E-pasts*; Tālrunis |
| `/skola/pieteiksanas` | Vārds, uzvārds*; E-pasts*; Tālrunis* |
| `/skola/ligums` | Vārds, uzvārds*; Personas kods*; Tālrunis*; Adrese*; E-pasts*; E-pasts (alt.); Pārstāv saskaņā ar (dzimšanas apliecība / cits dokuments); Bankas konta numurs* |
| `/makslu-skola/muzika/pieteiksanas` | Vārds, uzvārds*; E-pasts*; Personas kods*; Tālrunis*; Deklarētā adrese*; Faktiskā adrese* |
| `/form/pieteikums-muzikas-nodalai` | same as above |
| `/form/pieteikums-makslas-nodalai-v-2` | Vārds un uzvārds*; E-pasts*; Tālrunis*; Vecums*; Programma* |
| `/form/kulturas-patnis-adazos` | Vārds un uzvārds*; E-pasts*; Telefons*; Bērna vecums*; programmas (4 checkboxes) |
| `/form/makslas-nodalas-ligums-pieaugusa` | Vārds, uzvārds*; Personas kods*; Tālrunis*; Adrese*; E-pasts* |

## All crawled URLs

| Old path | New path | Imported as |
|---|---|---|
| `/` | `/` | page (home) |
| `/blogs` | `/blogs` | page |
| `/buj` | `/buj` | page |
| `/cdn-cgi/l/email-protection` | `/cdn-cgi/l/email-protection` | — (HTTP 404 on old site) |
| `/darbinieks/ieva-haselbauma` | `/kontakti` | page |
| `/form/kulturas-patnis-adazos` | `/form/kulturas-patnis-adazos` | page |
| `/form/makslas-nodalas-ligums-pieaugusa` | `/form/makslas-nodalas-ligums-pieaugusa` | page |
| `/form/pieteikums-makslas-nodalai-v-2` | `/form/pieteikums-makslas-nodalai-v-2` | page |
| `/form/pieteikums-muzikas-nodalai` | `/form/pieteikums-muzikas-nodalai` | page |
| `/konference` | `/konference` | — (Canva export, copy as static files) |
| `/kontakti` | `/kontakti` | page |
| `/kulturas_patnis_adazos` | `/kulturas-patnis-adazos` | page |
| `/makslu-skola` | `/makslu-skola` | page |
| `/makslu-skola/interesu-izglitiba` | `/makslu-skola/interesu-izglitiba` | page |
| `/makslu-skola/maksla` | `/makslu-skola/maksla` | page |
| `/makslu-skola/muzika` | `/makslu-skola/muzika` | page |
| `/makslu-skola/muzika/pieteiksanas` | `/makslu-skola/muzika/pieteiksanas` | page |
| `/par-patni` | `/par-patni` | page |
| `/par-patni/fakti` | `/par-patni/fakti` | page |
| `/par-patni/vesture` | `/par-patni/vesture` | page |
| `/par-patni/vizija-un-merki` | `/par-patni/vizija-un-merki` | page |
| `/personas-datu-aizsardziba` | `/personas-datu-aizsardziba` | page |
| `/pieteikties-skolai` | `/skola/pieteiksanas` | — (HTTP 404 on old site) |
| `/pirmsskola` | `/pirmsskola` | page |
| `/pirmsskola/adazos` | `/pirmsskola/adazos` | page |
| `/pirmsskola/adazos-legacy` | `/pirmsskola/adazos` | page |
| `/pirmsskola/gregora-iela` | `/pirmsskola/gregora-iela` | page |
| `/pirmsskola/gregora-iela-old` | `/pirmsskola/gregora-iela` | page |
| `/pirmsskola/maldugunu-iela` | `/pirmsskola/maldugunu-iela` | branch |
| `/pirmsskola/pieteiksanas` | `/pirmsskola/pieteiksanas` | page |
| `/pirmsskola/spargelitis` | `/pirmsskola/spargelitis` | branch |
| `/pirmsskola/ziedondarzs` | `/pirmsskola/ziedondarzs` | branch |
| `/playlab` | `/playlab` | page |
| `/ppms` | `/ppms` | page |
| `/prese` | `/prese` | page |
| `/raksts/20212022macibu-gads` | `/raksts/20212022macibu-gads` | article |
| `/raksts/20222023macibu-gads` | `/raksts/20222023macibu-gads` | article |
| `/raksts/20232024macibu-gads-aprilis` | `/raksts/20232024macibu-gads-aprilis` | article |
| `/raksts/20232024macibu-gads-februaris` | `/raksts/20232024macibu-gads-februaris` | article |
| `/raksts/20232024macibu-gads-maijs` | `/raksts/20232024macibu-gads-maijs` | article |
| `/raksts/20232024macibu-gads-maijs-un-vacu-valoda` | `/raksts/20232024macibu-gads-maijs-un-vacu-valoda` | article |
| `/raksts/20232024macibu-gads-marts` | `/raksts/20232024macibu-gads-marts` | article |
| `/raksts/20232024macibu-gads-novembris` | `/raksts/20232024macibu-gads-novembris` | article |
| `/raksts/20232024macibu-gads-oktobris` | `/raksts/20232024macibu-gads-oktobris` | article |
| `/raksts/20232024macibu-gads-septembris` | `/raksts/20232024macibu-gads-septembris` | article |
| `/raksts/20232024macibu-gadsdecembris` | `/raksts/20232024macibu-gadsdecembris` | article |
| `/raksts/20232024macibu-gadsjanvaris` | `/raksts/20232024macibu-gadsjanvaris` | article |
| `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-dziedataju-anci-krauzi` | `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-dziedataju-anci-krauzi` | article |
| `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-literatu-akselu-hirsu` | `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-literatu-akselu-hirsu` | article |
| `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-rakstnieku-jani-jonevu` | `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-rakstnieku-jani-jonevu` | article |
| `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-rezisoru-valteru-sili` | `/raksts/2425macg-aprilis-barona-filiale-tiksanas-ar-rezisoru-valteru-sili` | article |
| `/raksts/2425macg-aprilis-gregora-filiale` | `/raksts/2425macg-aprilis-gregora-filiale` | article |
| `/raksts/2425macg-februaris` | `/raksts/2425macg-februaris` | article |
| `/raksts/2425macg-marts-un-teatris` | `/raksts/2425macg-marts-un-teatris` | article |
| `/raksts/2425macg-novembris` | `/raksts/2425macg-novembris` | article |
| `/raksts/2425macg-oktobris` | `/raksts/2425macg-oktobris` | article |
| `/raksts/2425macibu-gads-basketbols` | `/raksts/2425macibu-gads-basketbols` | article |
| `/raksts/2425macibu-gads-junijs-ce-rezultati` | `/raksts/2425macibu-gads-junijs-ce-rezultati` | article |
| `/raksts/2425macibu-gadsdecembris` | `/raksts/2425macibu-gadsdecembris` | article |
| `/raksts/2425macibu-gadsjanvaris` | `/raksts/2425macibu-gadsjanvaris` | article |
| `/raksts/2425macibu-gadsmaijs` | `/raksts/2425macibu-gadsmaijs` | article |
| `/raksts/2425macibu-gadsmarts` | `/raksts/2425macibu-gadsmarts` | article |
| `/raksts/2425macibu-gadsseptembris` | `/raksts/2425macibu-gadsseptembris` | article |
| `/raksts/2526macg-barona-filiale-12klase-izzina-raina-induli-un-ariju` | `/raksts/2526macg-barona-filiale-12klase-izzina-raina-induli-un-ariju` | article |
| `/raksts/2526macg-barona-filiale-12klase-tiekas-ar-dzejnieci-maru-ulmi` | `/raksts/2526macg-barona-filiale-12klase-tiekas-ar-dzejnieci-maru-ulmi` | article |
| `/raksts/2526macg-barona-filiale-12klases-inzenieru-kurss-par-arhitekturu-saruna-ar-ilonu-vaivadi` | `/raksts/2526macg-barona-filiale-12klases-inzenieru-kurss-par-arhitekturu-saruna-ar-ilonu-vaivadi` | article |
| `/raksts/2526macg-barona-filiale-7klase-satiek-teatri-skola` | `/raksts/2526macg-barona-filiale-7klase-satiek-teatri-skola` | article |
| `/raksts/2526macg-barona-filiale-pie-11klases-viesos-valmieras-teatra-aktieris-krisjanis-strods` | `/raksts/2526macg-barona-filiale-pie-11klases-viesos-valmieras-teatra-aktieris-krisjanis-strods` | article |
| `/raksts/2526macg-barona-filiale-pie-vidusskoleniem-viesos-arsts-asivins` | `/raksts/2526macg-barona-filiale-pie-vidusskoleniem-viesos-arsts-asivins` | article |
| `/raksts/2526macg-barona-filiale-valmieras-teatra-aktieris-aksels-aizkalns` | `/raksts/2526macg-barona-filiale-valmieras-teatra-aktieris-aksels-aizkalns` | article |
| `/raksts/2526macg-barona-filiale-viesos-aktieris-un-dzejnieks-andris-bulis` | `/raksts/2526macg-barona-filiale-viesos-aktieris-un-dzejnieks-andris-bulis` | article |
| `/raksts/2526macg-oktobris-barona-filiale` | `/raksts/2526macg-oktobris-barona-filiale` | article |
| `/raksts/2526macg-septembris-barona-filiale` | `/raksts/2526macg-septembris-barona-filiale` | article |
| `/raksts/2526macg-tiksanas-ar-personibu-barona-filiale` | `/raksts/2526macg-tiksanas-ar-personibu-barona-filiale` | article |
| `/raksts/2526macibu-gads-barona-filiale-kursa-kulturas-kanons-ietvaros-viesos-regina-devite` | `/raksts/2526macibu-gads-barona-filiale-kursa-kulturas-kanons-ietvaros-viesos-regina-devite` | article |
| `/raksts/2526macibu-gads-barona-filiale-tiksanas-ar-aktieri-i-kniploku` | `/raksts/2526macibu-gads-barona-filiale-tiksanas-ar-aktieri-i-kniploku` | article |
| `/raksts/2526macibu-gads-barona-filiale-viesos-aktieris-meinards-liepins` | `/raksts/2526macibu-gads-barona-filiale-viesos-aktieris-meinards-liepins` | article |
| `/raksts/2526macibu-gads-februaris-reinis-dzudzilo` | `/raksts/2526macibu-gads-februaris-reinis-dzudzilo` | article |
| `/raksts/2526macibu-gads-tiksanas-barona-filiale-ar-profl-balodi` | `/raksts/2526macibu-gads-tiksanas-barona-filiale-ar-profl-balodi` | article |
| `/raksts/2526macibu-gads-vidusskoleni-tiekas-ar-aktrisi-sanitu-paulu-sarunas-par-antigoni` | `/raksts/2526macibu-gads-vidusskoleni-tiekas-ar-aktrisi-sanitu-paulu-sarunas-par-antigoni` | article |
| `/raksts/2627macg-dzejas-menesis-barona-filiale` | `/raksts/2627macg-dzejas-menesis-barona-filiale` | article |
| `/raksts/2627macg-vai-macities-var-ari-meza-klase` | `/raksts/2627macg-vai-macities-var-ari-meza-klase` | article |
| `/raksts/2627mg-lasisanas-nedela-gregora-filiale` | `/raksts/2627mg-lasisanas-nedela-gregora-filiale` | article |
| `/raksts/9-steam-soli` | `/raksts/9-steam-soli` | article |
| `/raksts/adazu-pirmsskolas-patnis-izglitibas-metodike-inga-grigaluna-par-ekologiskam-rotallietam` | `/raksts/adazu-pirmsskolas-patnis-izglitibas-metodike-inga-grigaluna-par-ekologiskam-rotallietam` | article |
| `/raksts/adazu-pirmsskolas-patnis-vaditaja-klinta-gangnuse-par-berniem-ka-zalajiem-agentiem-gimenes` | `/raksts/adazu-pirmsskolas-patnis-vaditaja-klinta-gangnuse-par-berniem-ka-zalajiem-agentiem-gimenes` | article |
| `/raksts/anita-muizniece-skeptiska-par-skolu-tikla-reformas-kriterijiem` | `/raksts/anita-muizniece-skeptiska-par-skolu-tikla-reformas-kriterijiem` | article |
| `/raksts/anita-muizniece-skolotajiem-ir-jabut-tiesibam-ka-noverst-likumparkapumus-skolas` | `/raksts/anita-muizniece-skolotajiem-ir-jabut-tiesibam-ka-noverst-likumparkapumus-skolas` | article |
| `/raksts/anita-muizniece-steam-skolam-nakotne-bus-izskirosa-loma` | `/raksts/anita-muizniece-steam-skolam-nakotne-bus-izskirosa-loma` | article |
| `/raksts/aptauja-skolas-videi-ir-izskirosa-loma-skolenu-sekmes` | `/raksts/aptauja-skolas-videi-ir-izskirosa-loma-skolenu-sekmes` | article |
| `/raksts/astra-rubene-ka-berni-var-macities-pienemt-atskirigo-caur-makslu` | `/raksts/astra-rubene-ka-berni-var-macities-pienemt-atskirigo-caur-makslu` | article |
| `/raksts/atvertas-durvis-gregora-skolas-filiale-1-6-klase-25012024` | `/raksts/atvertas-durvis-gregora-skolas-filiale-1-6-klase-25012024` | article |
| `/raksts/atverto-durvju-diena-toposo-pirmklasnieku-vecakiem-25-012024` | `/raksts/atverto-durvju-diena-toposo-pirmklasnieku-vecakiem-25-012024` | article |
| `/raksts/atverto-durvju-dienas-2425mg-7klases-skoleniem-atskats` | `/raksts/atverto-durvju-dienas-2425mg-7klases-skoleniem-atskats` | article |
| `/raksts/atverto-durvju-dienas-2425mg-decembri-kr-barona-ielas-filiale` | `/raksts/atverto-durvju-dienas-2425mg-decembri-kr-barona-ielas-filiale` | article |
| `/raksts/atverto-durvju-dienas-7-10-aprili-krbarona-iela-20` | `/raksts/atverto-durvju-dienas-7-10-aprili-krbarona-iela-20` | article |
| `/raksts/atverto-durvju-dienas-barona-skolas-filiale-7-12kl` | `/raksts/atverto-durvju-dienas-barona-skolas-filiale-7-12kl` | article |
| `/raksts/atverto-durvju-dienas-gregora-skolas-filiale-1-6-klase` | `/raksts/atverto-durvju-dienas-gregora-skolas-filiale-1-6-klase` | article |
| `/raksts/atverto-durvju-dienas-gregora-skolas-filiale-1-6-klase-atskats-0` | `/raksts/atverto-durvju-dienas-gregora-skolas-filiale-1-6-klase-atskats-0` | article |
| `/raksts/atverto-durvju-dienas-jaunajai-20262027macibu-gada-7klasei-noslegusas` | `/raksts/atverto-durvju-dienas-jaunajai-20262027macibu-gada-7klasei-noslegusas` | article |
| `/raksts/atverto-durvju-dienas-krbarona-skolas-filiale-7-12-klase-27032024` | `/raksts/atverto-durvju-dienas-krbarona-skolas-filiale-7-12-klase-27032024` | article |
| `/raksts/atverto-durvju-dienas-toposajai-7-klasei` | `/raksts/atverto-durvju-dienas-toposajai-7-klasei` | article |
| `/raksts/atverto-durvju-dienas-toposajai-7klasei-krbarona-iela-20` | `/raksts/atverto-durvju-dienas-toposajai-7klasei-krbarona-iela-20` | article |
| `/raksts/baltic-council-parstavji-patni` | `/raksts/baltic-council-parstavji-patni` | article |
| `/raksts/berns-grib-atvert-visas-durtinas-apgriezt-katru-akmeni-ka-nenokaut-berna-dabisko-interesi` | `/raksts/berns-grib-atvert-visas-durtinas-apgriezt-katru-akmeni-ka-nenokaut-berna-dabisko-interesi` | article |
| `/raksts/bernu-ar-ipasam-vajadzibam-darbi-apskatami-izstade-makslas-pecpusdiena` | `/raksts/bernu-ar-ipasam-vajadzibam-darbi-apskatami-izstade-makslas-pecpusdiena` | article |
| `/raksts/bernudarza-patnis-lapu-ielas-vaditaja-elina-kazanova-par-saimes-grupam` | `/raksts/bernudarza-patnis-lapu-ielas-vaditaja-elina-kazanova-par-saimes-grupam` | article |
| `/raksts/brali-un-masas-un-makslu-skolas-kulturas-patnis-audzeknu-makslas-darbu-izstade-akropole-riga` | `/raksts/brali-un-masas-un-makslu-skolas-kulturas-patnis-audzeknu-makslas-darbu-izstade-akropole-riga` | article |
| `/raksts/cambridge-english-2324mg` | `/raksts/cambridge-english-2324mg` | article |
| `/raksts/cambridge-english-eksameni-20242025macgada` | `/raksts/cambridge-english-eksameni-20242025macgada` | article |
| `/raksts/cambridge-english-eksameni-patni-jau-aprili` | `/raksts/cambridge-english-eksameni-patni-jau-aprili` | article |
| `/raksts/cambridge-english-eksamens` | `/raksts/cambridge-english-eksamens` | article |
| `/raksts/cambridge-english-eksamenu-rezultati-2024gada` | `/raksts/cambridge-english-eksamenu-rezultati-2024gada` | article |
| `/raksts/cambridge-english-macibu-process` | `/raksts/cambridge-english-macibu-process` | article |
| `/raksts/cambridge-english-panakumi-2223mg` | `/raksts/cambridge-english-panakumi-2223mg` | article |
| `/raksts/cambridge-english-patnis-preparation-centre` | `/raksts/cambridge-english-patnis-preparation-centre` | article |
| `/raksts/cambridge-english-pieteiksanas-20252026mg-eksamenam` | `/raksts/cambridge-english-pieteiksanas-20252026mg-eksamenam` | article |
| `/raksts/cambridge-english-rezultati-2425macibu-gada` | `/raksts/cambridge-english-rezultati-2425macibu-gada` | article |
| `/raksts/cela-uz-steam-skolu-iespeju-nodrosinasana-skoleniem-izmantojot-projektos-balstitu-macisanos` | `/raksts/cela-uz-steam-skolu-iespeju-nodrosinasana-skoleniem-izmantojot-projektos-balstitu-macisanos` | article |
| `/raksts/ja-macisimies-ka-roboti-nakotne-stradasim-robotu-laba` | `/raksts/ja-macisimies-ka-roboti-nakotne-stradasim-robotu-laba` | article |
| `/raksts/julija-lukjanovica-algoritmiska-domasana-un-lasitprasme-datorika-maziem-berniem-nav-tikai` | `/raksts/julija-lukjanovica-algoritmiska-domasana-un-lasitprasme-datorika-maziem-berniem-nav-tikai` | article |
| `/raksts/ka-turpmak-macit-matematiku-skola-pavisam-citadi-ka-agrak-vai-tomer-ka-senos-laikos` | `/raksts/ka-turpmak-macit-matematiku-skola-pavisam-citadi-ka-agrak-vai-tomer-ka-senos-laikos` | article |
| `/raksts/kada-ir-berna-fiziskajai-garigajai-un-intelektualajai-attistibai-labveliga-vide` | `/raksts/kada-ir-berna-fiziskajai-garigajai-un-intelektualajai-attistibai-labveliga-vide` | article |
| `/raksts/kapec-latvijai-nepieciesams-jauns-izglitibas-likums` | `/raksts/kapec-latvijai-nepieciesams-jauns-izglitibas-likums` | article |
| `/raksts/kristine-lepnane-sabiedriba-spiez-ipaso-bernu-vecakus-ienemt-kara-stavokli` | `/raksts/kristine-lepnane-sabiedriba-spiez-ipaso-bernu-vecakus-ienemt-kara-stavokli` | article |
| `/raksts/literatura-ii-kursa-ietvaros-barona-filiale-viesos-rezisors-rvaivars` | `/raksts/literatura-ii-kursa-ietvaros-barona-filiale-viesos-rezisors-rvaivars` | article |
| `/raksts/makslu-skolas-kulturas-patnis-direktore-astra-rubene-par-starptautiskas-gimenes-dienas` | `/raksts/makslu-skolas-kulturas-patnis-direktore-astra-rubene-par-starptautiskas-gimenes-dienas` | article |
| `/raksts/makslu-skolas-kulturas-patnis-zimejumu-akcija-mediku-atbalstam` | `/raksts/makslu-skolas-kulturas-patnis-zimejumu-akcija-mediku-atbalstam` | article |
| `/raksts/marupes-pirmsskolas-patnis-izglitibas-metodike-ieva-haselbauma-par-montesori-metodiku` | `/raksts/marupes-pirmsskolas-patnis-izglitibas-metodike-ieva-haselbauma-par-montesori-metodiku` | article |
| `/raksts/no-tiktok-lidz-velesanu-urnai-ka-jauniesiem-izdarit-savu-izveli` | `/raksts/no-tiktok-lidz-velesanu-urnai-ka-jauniesiem-izdarit-savu-izveli` | article |
| `/raksts/no-tiktok-lidz-velesanu-urnai-ka-jauniesiem-izdarit-savu-izveli-0` | `/raksts/no-tiktok-lidz-velesanu-urnai-ka-jauniesiem-izdarit-savu-izveli-0` | article |
| `/raksts/oktobri-atverto-durvju-dienas-1-6kl-gregora-iela-13a` | `/raksts/oktobri-atverto-durvju-dienas-1-6kl-gregora-iela-13a` | article |
| `/raksts/oktobri-atverto-durvju-dienas-7-12kl-krbarona-iela-20` | `/raksts/oktobri-atverto-durvju-dienas-7-12kl-krbarona-iela-20` | article |
| `/raksts/patna-absolventa-stasts-jagrs-teica-agentam-mums-vinu-vajag-latvijas-netalantiga-hokejista` | `/raksts/patna-absolventa-stasts-jagrs-teica-agentam-mums-vinu-vajag-latvijas-netalantiga-hokejista` | article |
| `/raksts/patna-ekoskola-viesojas-latvijas-radio-2-ricibu-dienas-2023` | `/raksts/patna-ekoskola-viesojas-latvijas-radio-2-ricibu-dienas-2023` | article |
| `/raksts/patnis-cambridge-english-preperation-centre-2627mg` | `/raksts/patnis-cambridge-english-preperation-centre-2627mg` | article |
| `/raksts/patnis-ir-uzsacis-dalibu-oecd-schools-projekta` | `/raksts/patnis-ir-uzsacis-dalibu-oecd-schools-projekta` | article |
| `/raksts/patnis-pirmsskolas-ziedondarzins-vaditaja-rudite-zilajeva-par-fiziskajam-aktivitatem-svaiga` | `/raksts/patnis-pirmsskolas-ziedondarzins-vaditaja-rudite-zilajeva-par-fiziskajam-aktivitatem-svaiga` | article |
| `/raksts/patnis-uzsak-personalizetas-macisanas-ieviesanu` | `/raksts/patnis-uzsak-personalizetas-macisanas-ieviesanu` | article |
| `/raksts/pieteiksanas-uz-10klasi-2425mg` | `/raksts/pieteiksanas-uz-10klasi-2425mg` | article |
| `/raksts/pieteiksanas-uz-7klasi-2425mg` | `/raksts/pieteiksanas-uz-7klasi-2425mg` | article |
| `/raksts/pisa-2022-pirmo-rezultatu-pazinosanas-pasakums` | `/raksts/pisa-2022-pirmo-rezultatu-pazinosanas-pasakums` | article |
| `/raksts/portrets-patnis-dibinataja-zane-ozola` | `/raksts/portrets-patnis-dibinataja-zane-ozola` | article |
| `/raksts/privatas-skolas-patnis-dibinataja-zane-ozola-par-klatienes-macibu-atsaksanu` | `/raksts/privatas-skolas-patnis-dibinataja-zane-ozola-par-klatienes-macibu-atsaksanu` | article |
| `/raksts/privatas-skolas-patnis-dibinataja-zane-ozola-par-pedagogu-darbu-pandemijas-laika` | `/raksts/privatas-skolas-patnis-dibinataja-zane-ozola-par-pedagogu-darbu-pandemijas-laika` | article |
| `/raksts/privatas-vidusskolas-patnis-direktore-agnese-putele-par-macibu-uzsaksanu-1-klase` | `/raksts/privatas-vidusskolas-patnis-direktore-agnese-putele-par-macibu-uzsaksanu-1-klase` | article |
| `/raksts/privatas-vidusskolas-patnis-muzikas-skolotajas-elzas-ozolas-ieteikumi-ka-radosi-apgut-muziku` | `/raksts/privatas-vidusskolas-patnis-muzikas-skolotajas-elzas-ozolas-ieteikumi-ka-radosi-apgut-muziku` | article |
| `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-atbalstu` | `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-atbalstu` | article |
| `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-dezurgrupu` | `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-dezurgrupu` | article |
| `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-pedagogu` | `/raksts/privatas-vidusskolas-un-bernudarzu-patnis-valdes-locekle-inguna-vartina-par-pedagogu` | article |
| `/raksts/privatskolu-finansesana-kas-mainisies-lidz-ar-skolu-reformu` | `/raksts/privatskolu-finansesana-kas-mainisies-lidz-ar-skolu-reformu` | article |
| `/raksts/projektos-balstita-macisanas-uzvaras-gajiens-musdienigas-bet-kvalitativas-izglitibas` | `/raksts/projektos-balstita-macisanas-uzvaras-gajiens-musdienigas-bet-kvalitativas-izglitibas` | article |
| `/raksts/radosums-kritiski-svariga-prasme-lai-konkuretu-nakotnes-darba-tirgu` | `/raksts/radosums-kritiski-svariga-prasme-lai-konkuretu-nakotnes-darba-tirgu` | article |
| `/raksts/si-gada-steam-temats-maksligais-intelekts` | `/raksts/si-gada-steam-temats-maksligais-intelekts` | article |
| `/raksts/signalvelesanas-2627macibu-gada` | `/raksts/signalvelesanas-2627macibu-gada` | article |
| `/raksts/steam-1-6-klasu-skolenu-sacensibas` | `/raksts/steam-1-6-klasu-skolenu-sacensibas` | article |
| `/raksts/steam-1klase-ka-petit-visumu` | `/raksts/steam-1klase-ka-petit-visumu` | article |
| `/raksts/steam-2425macibu-gada` | `/raksts/steam-2425macibu-gada` | article |
| `/raksts/steam-3klase-pieredzes-apmaina-lietuva-siaures-licejus` | `/raksts/steam-3klase-pieredzes-apmaina-lietuva-siaures-licejus` | article |
| `/raksts/steam-apvieno-dizainu-un-biologiju` | `/raksts/steam-apvieno-dizainu-un-biologiju` | article |
| `/raksts/steam-atvertas-durvis` | `/raksts/steam-atvertas-durvis` | article |
| `/raksts/steam-atvertas-durvis-0` | `/raksts/steam-atvertas-durvis-0` | article |
| `/raksts/steam-gada-nosleguma-konference` | `/raksts/steam-gada-nosleguma-konference` | article |
| `/raksts/steam-istenojums-1ceturksni` | `/raksts/steam-istenojums-1ceturksni` | article |
| `/raksts/steam-istenosanas-soli-no-augusta-lidz-maijam` | `/raksts/steam-istenosanas-soli-no-augusta-lidz-maijam` | article |
| `/raksts/steam-konference` | `/raksts/steam-konference` | article |
| `/raksts/steam-konkurss` | `/raksts/steam-konkurss` | article |
| `/raksts/steam-olimpiade` | `/raksts/steam-olimpiade` | article |
| `/raksts/steam-olimpiade-2026gada-noslegusies-ar-lieliskiem-rezultatiem` | `/raksts/steam-olimpiade-2026gada-noslegusies-ar-lieliskiem-rezultatiem` | article |
| `/raksts/steam-projekts-1klase-gaisma-un-skana` | `/raksts/steam-projekts-1klase-gaisma-un-skana` | article |
| `/raksts/steam-projekts-1klasei-sadarbiba-ar-getlini-eko` | `/raksts/steam-projekts-1klasei-sadarbiba-ar-getlini-eko` | article |
| `/raksts/steam-projektu-apskats` | `/raksts/steam-projektu-apskats` | article |
| `/raksts/steam-robo-skola` | `/raksts/steam-robo-skola` | article |
| `/raksts/steam-sadarbiba-ar-futurimo` | `/raksts/steam-sadarbiba-ar-futurimo` | article |
| `/raksts/steam-sadarbiba-ar-futurimo-decembri` | `/raksts/steam-sadarbiba-ar-futurimo-decembri` | article |
| `/raksts/steam-skola-atverto-durvju-diena` | `/raksts/steam-skola-atverto-durvju-diena` | article |
| `/raksts/steam-skolina-toposajiem-pirmklasniekiem` | `/raksts/steam-skolina-toposajiem-pirmklasniekiem` | article |
| `/raksts/ticiet-pedagogi-ir-gatavi-jaunam-idejam` | `/raksts/ticiet-pedagogi-ir-gatavi-jaunam-idejam` | article |
| `/raksts/uznemeju-skolu-direktoru-mentoringa-programma-iesaistijusies-skolu-direktori-no-visas` | `/raksts/uznemeju-skolu-direktoru-mentoringa-programma-iesaistijusies-skolu-direktori-no-visas` | article |
| `/raksts/vai-latvija-berni-joprojam-macas-atzimei-nevis-zinasanam` | `/raksts/vai-latvija-berni-joprojam-macas-atzimei-nevis-zinasanam` | article |
| `/raksts/vai-latvija-berni-joprojam-macas-atzimei-nevis-zinasanam-0` | `/raksts/vai-latvija-berni-joprojam-macas-atzimei-nevis-zinasanam-0` | article |
| `/raksts/vasaras-brivlaiks-vel-nav-beidzies-tacu-daudzas-privatas-vidusskola-patnis-saimes-gimenes` | `/raksts/vasaras-brivlaiks-vel-nav-beidzies-tacu-daudzas-privatas-vidusskola-patnis-saimes-gimenes` | article |
| `/raksts/vebinars-par-maksligo-intelektu` | `/raksts/vebinars-par-maksligo-intelektu` | article |
| `/raksts/vidusskolas-patnis-direktore-esam-noilgojusies-pec-skolas` | `/raksts/vidusskolas-patnis-direktore-esam-noilgojusies-pec-skolas` | article |
| `/raksts/vidusskolas-patnis-direktore-esam-noilgojusies-pec-skolas-0` | `/raksts/vidusskolas-patnis-direktore-esam-noilgojusies-pec-skolas-0` | article |
| `/raksts/vidusskolas-patnis-matematikas-skolotajs-aleksandrs-vorobjovs-raidijuma-aizliegtais` | `/raksts/vidusskolas-patnis-matematikas-skolotajs-aleksandrs-vorobjovs-raidijuma-aizliegtais` | article |
| `/raksts/zane-ozola-kas-kave-latvijas-izglitibas-attistibu` | `/raksts/zane-ozola-kas-kave-latvijas-izglitibas-attistibu` | article |
| `/raksts/zane-ozola-vai-mums-pietrukst-drosmes-ieklaujosajai-izglitibai` | `/raksts/zane-ozola-vai-mums-pietrukst-drosmes-ieklaujosajai-izglitibai` | article |
| `/sikdatnes` | `/sikdatnes` | page |
| `/skola` | `/skola` | page |
| `/skola/1-6-klase` | `/skola/1-6-klase` | branch |
| `/skola/7-12` | `/skola/7-12` | branch |
| `/skola/absolventi` | `/skola/absolventi` | page |
| `/skola/attalinatas-macibas` | `/skola/attalinatas-macibas` | page |
| `/skola/atvertas-durvis` | `/skola/atvertas-durvis` | page |
| `/skola/cambridge` | `/skola/cambridge` | page |
| `/skola/ekoskola` | `/skola/ekoskola` | page |
| `/skola/erasmus` | `/skola/erasmus` | page |
| `/skola/galerija` | `/skola/galerija` | page |
| `/skola/kiva` | `/skola/kiva` | page |
| `/skola/konkursiunolimpiades` | `/skola/konkursiunolimpiades` | page |
| `/skola/ligums` | `/skola/ligums` | page |
| `/skola/mentorings` | `/skola/mentorings` | page |
| `/skola/metodiskais-darbs` | `/skola/metodiskais-darbs` | page |
| `/skola/oecd` | `/skola/oecd` | page |
| `/skola/pasparvalde` | `/skola/pasparvalde` | page |
| `/skola/pasākumi` | `/skola/pasakumi` | page |
| `/skola/patnis-tv` | `/skola/patnis-tv` | page |
| `/skola/pieteiksanas` | `/skola/pieteiksanas` | page |
| `/skola/sadarbibas-partneri` | `/skola/sadarbibas-partneri` | page |
| `/skola/skolas-padome` | `/skola/skolas-padome` | page |
| `/skola/skolas-soma` | `/skola/skolas-soma` | page |
| `/skola/steam` | `/skola/steam` | page |
| `/skola/vpd` | `/skola/vpd` | page |
| `/taxonomy/term/5` | `/kontakti` | page |
| `/taxonomy/term/6` | `/kontakti` | page |
| `/taxonomy/term/8` | `/kontakti` | page |
| `/vakances` | `/vakances` | — (HTTP 403 on old site) |
