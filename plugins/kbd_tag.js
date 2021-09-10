const CHAR = {
  ',': 'Comma (,)',
  '.': 'Period (.)',
  ';': 'Semicolon (;)',
  ':': 'Colon (:)',
  '`': 'Backtick (`)',
  '-': 'Minus Sign (-)',
  '+': 'Plus Sign (+)',
  '=': 'Equals Sign (=)',
  '_': 'Underscore (_)',
  '~': 'Tilde (~)'
}
const clarifyChar = key => CHAR[key] && [key, CHAR[key]]


const modEnt = key => {
  const modRegex = /^(comm(?:and)?|cmd|clover)|(cont(?:rol)?|ctrl|ctl)|(alt)|(opt(?:ion)?)|(shift)|(func(?:tion)?|fn)|(win(?:dows)?)$/
  const modSub = [
    ['&#8984; Command', 'Command Key'],
    ['&#8963; Ctrl', 'Control Key'],
    ['&#8997; Alt', 'Alt Key'],
    ['&#8997; Option', 'Option Key'],
    ['&#8679; Shift', 'Shift Key'],
    ['Fn', 'Function Key'],
    ['<i class="fas fa-windows"></i>', 'Windows Key']
  ]

  const match = key.match(modRegex) ?? []
  return modSub[match.findIndex(m => m)]
}


const keyEnt = key => {
  const entRegex = /(f\d{1,2})|(tab)|(caps(?:lock)?)|(return|keypadenter)|(del(?:ete)?)|(backspace)|(esc(?:ape)?)|(right)|(left)|(up)|(down)|(pgup|pageup)|(pgdn|pagedown)|(home)|(end)|(ins(?:ert)?)|(click)$/i
  const entSub = [
    [str => `F${str.slice(1)}`, str => `F${str.slice(1)} Key`],
    ['Tab', 'Tab Key'],
    ['&#8682; Caps Lock', 'Caps Lock Key'],
    ['&#9166; Return', 'Return Key'],
    ['&#8998; Delete', 'Delete'],
    ['&#9003; Backspace', 'Backspace'],
    ['&#9099; Esc', 'Escape Key'],
    ['&rarr;', 'Right Arrow Key'],
    ['&larr;', 'Left Arrow Key'],
    ['&uarr;', 'Up Arrow Key'],
    ['&darr;', 'Down Arrow Key'],
    ['&#8670; PgUp', 'Page Up Key'],
    ['&#8671; PgDn', 'Page Down Key'],
    ['&#6598; Home', 'Home Key'],
    ['&#8600; End', 'End Key'],
    ['Ins', 'Insert key'],
    ['<i class="fas fa-mouse-pointer"></i>', 'Left Click']
  ]

  const match = key.match(entRegex)
  if (!match)
    return [key, key.toUpperCase()]
  const sub = entSub[match.findIndex((m, i) => m && i > 0) - 1]
  return [key.replace(entRegex, sub[0]), key.replace(entRegex, sub[1])]
}


const createCombo = markup => markup
  .split(' / ')
  .map(k => k.split(/(?<=\S)[-+](?=\S)/))
  .map(keys => keys
      .reduce((combo, k) => {
        const mod = modEnt(k)
        if (mod)
          combo.mods.push(mod)
        else
          combo.keys.push(clarifyChar(k) ?? keyEnt(k))
        return combo
      }, { mods: [], keys: [] }))


module.exports = opt => (...keycombo) => keycombo
    .filter(k => k)
    .map(createCombo)
    .flat()
    .map(c => {
      const kbd = [
        ...c.mods.map(k => `<kbd class="mod">${k[0]}</kbd>`),
        ...c.keys.map(k => `<kbd class="key">${k[0]}</kbd>`)
      ].join(opt?.keyJoiner ?? '-')
      const title = [...c.mods.map(k => k[1]), ...c.keys.map(k => k[1])].join('-')
      return `<span class="keycombo separated" title="${title}">${kbd}</span>`
    })
    .join(opt?.comboJoiner ?? '/')
