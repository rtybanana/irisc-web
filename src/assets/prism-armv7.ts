import { languages } from 'prismjs'
import { tokens } from '@/constants/tokens';

export const branchRegex = /\b(b|bl|bx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i

languages.armv7 =  {
	[tokens.string]: {
		pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/
	},
	[tokens.line_comment]: {
		pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
		greedy: true
	},
	[tokens.bi_operand]: {
		pattern: /\b(cmn|cmp|mov|mvn|teq|tst)(s)?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.tri_operand]: {
		pattern: /\b(adc|add|and|bic|eor|orr|rsb|rsc|sbc|sub)(s)?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.multiply]: {
		pattern: /\b(mul|mla|mls)(s)?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.branch]: {
		pattern: branchRegex,
		alias: 'operation'
	},
	[tokens.shift]: {
		pattern: /\b(lsl|lsr|asr|ror|rrx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.transfer.single]: { 
		pattern: /\b(str|ldr)(b)?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.transfer.block]: {
		pattern: /\b(stm|ldm)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?(fd|ed|fa|ea|ia|ib|da|db)?\b/i,
		alias: 'operation'
	},
	[tokens.transfer.stack]: {
		pattern: /\b(push|pop)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,
		alias: 'operation'
	},
	[tokens.register]: {
		pattern: /\b(r([0-9]|(10|11|12))|(sp|lr|pc))\b/i,
	},
	[tokens.immediate]: [
		{ pattern: /#\b0x(\d|[a-f])+\b/i, alias: 'hex' },
		{ pattern: /#\b0b(0|1)+\b/i, alias: 'bin' },
		{ pattern: /#\b0[0-7]+\b/i, alias: 'oct' },
		{ pattern: /#\b(0d)?(\d)+\b/i, alias: 'dec' }
	],
	[tokens.number]: [
		{ pattern: /\b0x(\d|[a-f])+\b/i, alias: 'hex' },
		{ pattern: /\b0b(0|1)+\b/i, alias: 'bin' },
		{ pattern: /\b0[0-7]+\b/i, alias: 'oct' },
		{ pattern: /\b(0d)?(\d)+\b/i, alias: 'dec' }
	],
	[tokens.indexer]: [
		{ pattern: /\[/, alias: 'start' },
		{ pattern: /\]/, alias: 'end' },
	],
	[tokens.reg_list]: [
		{ pattern: /\{/, alias: 'start' },
		{ pattern: /\}/, alias: 'end' },
	],
	// 'number': /(?:\b|(?=\$))(?:0[hx](?:\.[\da-f]+|[\da-f]+(?:\.[\da-f]+)?)(?:p[+-]?\d+)?|\d[\da-f]+[hx]|\$\d[\da-f]*|0[oq][0-7]+|[0-7]+[oq]|0[by][01]+|[01]+[by]|0[dt]\d+|(?:\d+(?:\.\d+)?|\.\d+)(?:\.?e[+-]?\d+)?[dt]?)\b/i,
	[tokens.comma]: /,/,
	[tokens.directive]: /\.\b(text|data|global|extern|byte|hword|word|asciz|skip|balign)\b/m,
	[tokens.data_label]: /=\b[A-Za-z_][A-Za-z_\d]+\b/m,
	[tokens.sign]: [
		{ pattern: /-/m, alias: "minus" },
		{ pattern: /\+/m, alias: "plus" }
	],
	[tokens.updating]: /!/m,
	[tokens.label]: /\b[A-Za-z_][A-Za-z_\d]+\b:/m,
	[tokens.op_label]: /\b[A-Za-z_][A-Za-z_\d]+\b/m,
	[tokens.end]: /\n/m,
	[tokens.whitespace]: /\s+/,
	[tokens.unknown]: /.+/
};
