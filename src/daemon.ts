const originalToNodeMap: Map<string, Node> = new Map()
const nodeToOriginalMap: Map<Node, string> = new Map()

const workingTranslation: Map<string, string> = new Map()

function getTranslationFromOriginal(original: string) {
  const translation = workingTranslation.get(original)
  return translation || original
}

function updateForOriginal(original: string) {
  const node = originalToNodeMap.get(original)
  if (!node) return
  updateNode(node)
}

function updateNode(node: Node) {
  const original = nodeToOriginalMap.get(node)
  if (!original) return
  const translation = getTranslationFromOriginal(original)
  if (node.textContent !== translation) node.textContent = translation
}

function forSelfAndAllDescendants(root: Node, fun: (node: Node) => void) {
  if (root.nodeType === Node.TEXT_NODE) {
    fun(root)
  } else if (root instanceof Element) {
    for (const child of root.childNodes) {
      forSelfAndAllDescendants(child, fun)
    }
  }
}

function registerSelfAndAllDescendants(root: Node) {
  forSelfAndAllDescendants(root, node => {
    if (node.nodeType !== Node.TEXT_NODE) throw Error("text node expected")
    const original = node.textContent
    if (!original) return
    if (originalToNodeMap.has(original))
      throw Error("duplicate original text inserted")
    if (nodeToOriginalMap.has(node)) throw Error("duplicate node insertion")
    originalToNodeMap.set(original, node)
    nodeToOriginalMap.set(node, original)
    updateNode(node)
  })
}

function unregisterSelfAndAllDescendants(root: Node) {
  forSelfAndAllDescendants(root, node => {
    if (node.nodeType !== Node.TEXT_NODE) throw Error("text node expected")
    const original = nodeToOriginalMap.get(node)
    if (!original) throw Error("removal of unknown node")
    nodeToOriginalMap.delete(node)
    originalToNodeMap.delete(original)
  })
}

const mobserver = new MutationObserver((records: MutationRecord[]) => {
  for (const record of records) {
    if (record.type === "childList") {
      for (const node of record.addedNodes) registerSelfAndAllDescendants(node)
      for (const node of record.removedNodes)
        unregisterSelfAndAllDescendants(node)
    } else if (record.type === "characterData") {
      unregisterSelfAndAllDescendants(record.target)
      registerSelfAndAllDescendants(record.target)
    }
  }
})

export function switchTextTo(original: string, translation: string) {
  workingTranslation.set(original, translation)
  updateForOriginal(original)
}

export function initialize(root: Node) {
  mobserver.observe(root, {
    subtree: true,
    characterData: true,
    childList: true
  })
  //registerSelfAndAllDescendants(root)
}
