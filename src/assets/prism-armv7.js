import { languages } from 'prismjs'

languages.armv7 = {
	'line-comment': {
		pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
		greedy: true
	},
	'bi-operand': {
		pattern: /\b(cmn|cmp|mov|mvn|teq|tst)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'tri-operand': {
		pattern: /\b(adc|add|and|bic|eor|orr|rsb|rsc|sbc|sub)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'branch': {
		pattern: /\b(b|bl|bx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'shift': {
		pattern: /\b(lsl|lsr|asr|ror|rrx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'register': {
		pattern: /\b(r([0-9]|(10|11|12))|(sp|lr|pc))\b/i,
	},
  'hex': {
    pattern:  /#?\b0x(\d|[a-f])+\b/i,
    alias: 'immediate'
  },
  'bin': {
    pattern: /#?\b0b(0|1)+\b/i,
    alias: 'immediate'
  },
  'oct': {
    pattern:  /#?\b0[0-7]+\b/i,
    alias: 'immediate'
  },
  'dec': {
    pattern:  /#?\b(0d)?(\d)+\b/i,
    alias: 'immediate'
  },
	// 'number': /(?:\b|(?=\$))(?:0[hx](?:\.[\da-f]+|[\da-f]+(?:\.[\da-f]+)?)(?:p[+-]?\d+)?|\d[\da-f]+[hx]|\$\d[\da-f]*|0[oq][0-7]+|[0-7]+[oq]|0[by][01]+|[01]+[by]|0[dt]\d+|(?:\d+(?:\.\d+)?|\.\d+)(?:\.?e[+-]?\d+)?[dt]?)\b/i,
	'comma': /,/,
	'label': /^\b[A-Za-z_][A-Za-z_\d]+\b:/m,
	'op-label': /(?!^)\b[A-Za-z_][A-Za-z_\d]+\b/m,
	'end': /\n/m
};