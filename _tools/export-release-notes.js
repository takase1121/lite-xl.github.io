const { join } = require('path')
const { writeFileSync } = require('fs')

const sanitize = require('sanitize-filename')
const c = require('centra')


const USER_AGENT = 'ReleaseScrapperBot/1.0 (+https://github.com/lite-xl/lite-xl.github.io)'
const REPO_NAME = 'lite-xl/lite-xl'
const DIR = '_posts'

const assetRegex = /lite-xl-([^-]+)-(x86-64|[^-]+)(-msys)?\.(.+)$/
const osList = {
  linux: 'Linux',
  macos: 'MacOS',
  win: 'Windows',
}
const archList = {
  'x86': '32-bit',
  'x86-64': '64-bit',
}
const formatList = {
  '-msyszip': 'MSYS-style zip',
  'zip': 'zip',
  'tar.gz': 'tarball',
  'dmg': 'Installer',
  'exe': 'Installer',
}


const dateStr = date => date.getFullYear().toString()
  + '-'
  + (date.getMonth() + 1).toString().padStart(2, '0')
  + '-'
  + date.getDate().toString().padStart(2, '0')


const json = url => c(url)
  .header('User-Agent', USER_AGENT)
  .header('Application-Type', 'application/vnd.github.v3+json')
  .send()
  .then(r => r.json())


const assetLink = asset => {
  const [_, os, arch, msys, format] = asset.name.match(assetRegex)
  return `- [${osList[os]} ${archList[arch]} ${formatList[(msys || '') + format]}](${asset.browser_download_url})`
}


const articleName = (name, date) => `${dateStr(new Date(date))}-${name}.md`


const makeArticle = release => `
---
title: "${release.name}"
author: "${release.author.login}"
date: "${new Date(release.published_at).toISOString()}"
---
${release.body}

##### Download links:
${release.assets.filter(a => assetRegex.test(a.name)).map(assetLink).join('\n') || '- None'}
`.trim()


async function main() {
  const releases = await json(`https://api.github.com/repos/${REPO_NAME}/releases`)
  const exported = releases
    .map(makeArticle)
    .map((article, i)=> [ article, sanitize(articleName(releases[i].name, releases[i].published_at)) ])
    .map(([article, name]) => writeFileSync(join(DIR, name), article))

  console.log(`Exported ${exported.length} release note(s)`)
}

main()
