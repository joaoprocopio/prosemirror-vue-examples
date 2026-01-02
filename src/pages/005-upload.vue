<script setup lang="ts">
import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { onMounted, shallowRef, useTemplateRef } from 'vue'

const editorEl = useTemplateRef('editor')
const contentEl = useTemplateRef('content')

const view = shallowRef<EditorView>()

onMounted(() => {
  view.value = new EditorView(editorEl.value!, {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(contentEl.value!),
      plugins: exampleSetup({ schema }),
    }),
  })
})
</script>

<template>
  <div id="editor" ref="editor"></div>

  <div style="display: none" id="content" ref="content">
    <p>Select some text to see a tooltip with the size of your selection.</p>
    <p>(That's not the most useful use of a tooltip, but it's a nicely simple example.)</p>
  </div>
</template>

<style>
.tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 20;
  background: white;
  border: 1px solid silver;
  border-radius: 2px;
  padding: 2px 10px;
  margin-bottom: 7px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
.tooltip:before {
  content: '';
  height: 0;
  width: 0;
  position: absolute;
  left: 50%;
  margin-left: -5px;
  bottom: -6px;
  border: 5px solid transparent;
  border-bottom-width: 0;
  border-top-color: silver;
}
.tooltip:after {
  content: '';
  height: 0;
  width: 0;
  position: absolute;
  left: 50%;
  margin-left: -5px;
  bottom: -4.5px;
  border: 5px solid transparent;
  border-bottom-width: 0;
  border-top-color: white;
}
#editor {
  position: relative;
}
</style>
