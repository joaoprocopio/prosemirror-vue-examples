<script setup lang="ts">
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { onMounted, shallowRef, useTemplateRef } from 'vue'
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown'

interface IView {
  get content(): string
  focus(): void
  destroy(): void
}

interface IViewConstructor {
  new (target: HTMLElement, content: string): IView
}

class MarkdownView implements IView {
  textarea: HTMLTextAreaElement

  constructor(target: HTMLElement, content: string) {
    this.textarea = target.appendChild(document.createElement('textarea'))
    this.textarea.value = content
  }

  get content() {
    return this.textarea.value
  }
  focus() {
    this.textarea.focus()
  }
  destroy() {
    this.textarea.remove()
  }
}

class ProseMirrorView implements IView {
  view: EditorView

  constructor(target: HTMLElement, content: string) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({ schema }),
      }),
    })
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc)
  }
  focus() {
    this.view.focus()
  }
  destroy() {
    this.view.destroy()
  }
}

const editorEl = useTemplateRef('editor')
const contentEl = useTemplateRef('content')

const view = shallowRef<IView>()

function radioChange(event: Event) {
  const button = event.target as HTMLInputElement

  if (!button.checked) return

  const View: IViewConstructor = button.value == 'markdown' ? MarkdownView : ProseMirrorView

  if (view.value instanceof View) return

  const content = view.value!.content

  view.value!.destroy()
  view.value = new View(editorEl.value!, content)
  view.value.focus()
}

onMounted(() => {
  view.value = new MarkdownView(editorEl.value!, contentEl.value!.value)
})
</script>

<template>
  <div id="editor" ref="editor" style="margin-bottom: 0"></div>
  <div style="text-align: center">
    <label style="border-right: 1px solid silver">
      Markdown
      <input
        @change="radioChange"
        type="radio"
        name="inputformat"
        value="markdown"
        checked
      />&nbsp;</label
    >
    <label
      >&nbsp;<input @change="radioChange" type="radio" name="inputformat" value="prosemirror" />
      WYSIWYM</label
    >
  </div>

  <div style="display: none">
    <textarea id="content" ref="content">
This is a comment written in [Markdown](http://commonmark.org). *You* may know the syntax for inserting a link, but does your whole audience?&#13;&#13;So you can give people the **choice** to use a more familiar, discoverable interface.</textarea
    >
  </div>
</template>

<style>
.ProseMirror {
  height: 120px;
  overflow-y: auto;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
textarea {
  width: 100%;
  height: 123px;
  border: 1px solid silver;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 3px 10px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
}
.ProseMirror-menubar-wrapper,
#markdown textarea {
  display: block;
  margin-bottom: 4px;
}
</style>
