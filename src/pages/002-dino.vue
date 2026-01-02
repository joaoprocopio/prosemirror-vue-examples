<script setup lang="ts">
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, type NodeSpec } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { buildMenuItems, exampleSetup } from 'prosemirror-example-setup'
import { MenuItem, type MenuElement } from 'prosemirror-menu'
import { onMounted, shallowRef, useTemplateRef } from 'vue'

const editorEl = useTemplateRef('editor')
const contentEl = useTemplateRef('content')

const state = shallowRef<EditorState>()
const view = shallowRef<EditorView>()

const dinos = [
  'brontosaurus',
  'stegosaurus',
  'triceratops',
  'tyrannosaurus',
  'pterodactyl',
] as const

type Dinos = (typeof dinos)[number]

const dinoNodeSpec: NodeSpec = {
  attrs: { type: { default: 'brontosaurus' } },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM(node) {
    return [
      'img',
      {
        'dino-type': node.attrs.type,
        title: node.attrs.type,
        src: `/img/dino/${node.attrs.type}.png`,
        class: 'dinosaur',
      },
    ]
  },
  parseDOM: [
    {
      tag: 'img[dino-type]',
      getAttrs(dom) {
        const type = dom.getAttribute('dino-type')
        return dinos.indexOf(type as Dinos) > -1
          ? {
              type,
            }
          : false
      },
    },
  ],
}

const dinoSchema = new Schema({
  nodes: schema.spec.nodes.addBefore('image', 'dino', dinoNodeSpec),
  marks: schema.spec.marks,
})

const dinoType = dinoSchema.nodes.dino!

function insertDino(type: string) {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void) {
    const { $from } = state.selection,
      index = $from.index()

    if (!$from.parent.canReplaceWith(index, index, dinoType)) {
      return false
    }

    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(dinoType.create({ type })))
    }

    return true
  }
}

onMounted(() => {
  const startDoc = DOMParser.fromSchema(dinoSchema).parse(contentEl.value!)
  const menu = buildMenuItems(dinoSchema)

  dinos.forEach((dino) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((menu.insertMenu as any).content as MenuElement[]).push(
      new MenuItem({
        title: `Insert ${dino}`,
        label: dino.charAt(0).toUpperCase() + dino.slice(1),
        enable(state) {
          return insertDino(dino)(state)
        },
        run: insertDino(dino),
      }),
    )
  })

  state.value = EditorState.create({
    doc: startDoc,
    plugins: exampleSetup({ schema: dinoSchema, menuContent: menu.fullMenu }),
  })

  view.value = new EditorView(editorEl.value!, {
    state: state.value,
  })
})
</script>

<template>
  <div id="editor" ref="editor" />

  <div style="display: none" ref="content">
    <p>This is your dinosaur-enabled editor. The insert menu allows you to insert dinosaurs.</p>
    <p>
      This paragraph <img class="dinosaur" dino-type="stegosaurus" />, for example,
      <img class="dinosaur" dino-type="triceratops" />
      is full <img class="dinosaur" dino-type="tyrannosaurus" /> of dinosaurs.
    </p>
    <p>Dinosaur nodes can be selected, copied, pasted, dragged, and so on.</p>
  </div>
</template>

<style>
img.dinosaur {
  height: 40px;
  vertical-align: bottom;
  border: 1px solid #0ae;
  border-radius: 4px;
  background: #ddf6ff;
}
</style>
