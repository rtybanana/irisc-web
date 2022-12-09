import { languages } from 'prismjs'

languages.armv7 =  {
	'string': {
		pattern: /".*"/m
	},
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
	'single-transfer': { 
		pattern: /\b(str|ldr)(b)?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'block-transfer': {
		pattern: /\b(stm|ldm)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?(fd|ed|fa|ea|ia|ib|da|db)?\b/i,
		alias: 'operation'
	},
	'stack-transfer': {
		pattern: /\b(push|pop)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	'register': {
		pattern: /\b(r([0-9]|(10|11|12))|(sp|lr|pc))\b/i,
	},
	'immediate': [
		{ pattern: /#\b0x(\d|[a-f])+\b/i, alias: 'hex' },
		{ pattern: /#\b0b(0|1)+\b/i, alias: 'bin' },
		{ pattern: /#\b0[0-7]+\b/i, alias: 'oct' },
		{ pattern: /#\b(0d)?(\d)+\b/i, alias: 'dec' }
	],
	'number': [
		{ pattern: /\b0x(\d|[a-f])+\b/i, alias: 'hex' },
		{ pattern: /\b0b(0|1)+\b/i, alias: 'bin' },
		{ pattern: /\b0[0-7]+\b/i, alias: 'oct' },
		{ pattern: /\b(0d)?(\d)+\b/i, alias: 'dec' }
	],
	'indexer': [
		{ pattern: /\[/, alias: 'start' },
		{ pattern: /\]/, alias: 'end' },
	],
	'reg-list': [
		{ pattern: /\{/, alias: 'start' },
		{ pattern: /\}/, alias: 'end' },
	],
	// 'number': /(?:\b|(?=\$))(?:0[hx](?:\.[\da-f]+|[\da-f]+(?:\.[\da-f]+)?)(?:p[+-]?\d+)?|\d[\da-f]+[hx]|\$\d[\da-f]*|0[oq][0-7]+|[0-7]+[oq]|0[by][01]+|[01]+[by]|0[dt]\d+|(?:\d+(?:\.\d+)?|\.\d+)(?:\.?e[+-]?\d+)?[dt]?)\b/i,
	'comma': /,/,
	'directive': /\.\b(text|data|global|extern|byte|hword|word|asciz|skip)\b/m,
	'data-label': /=\b[A-Za-z_][A-Za-z_\d]+\b/m,
	'sign': [
		{ pattern: /-/m, alias: "minus" },
		{ pattern: /\+/m, alias: "plus" }
	],
	'updating': /!/m,
	'label': /\b[A-Za-z_][A-Za-z_\d]+\b:/m,
	'op-label': /\b[A-Za-z_][A-Za-z_\d]+\b/m,
	'end': /\n/m,
	'whitespace': /\s+/,
	'unknown': /.+/
};