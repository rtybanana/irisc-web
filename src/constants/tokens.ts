export const tokens = {
  // operations
  bi_operand: "bi-operand",
  tri_operand: "tri-operand",
  branch: "branch",
  shift: "shift",
  transfer: {
    single: "single-transfer",
    block: "block-transfer",
    stack: "stack-transfer",
  } as const,
  
  // components
  string: "string",
  register: "register",
  immediate: "immediate",
  number: "number",
  indexer: "indexer",
  reg_list: "reg-list",
  comma: "comma",
  data_label: "data-label",
  sign: "sign",
  updating: "updating",
  label: "label",
  op_label: "op-label",

  // auxiliary
  directive: "directive",
  line_comment: "line-comment",
  end: "end",
  whitespace: "whitespace",
  unknown: "unknown"
} as const;