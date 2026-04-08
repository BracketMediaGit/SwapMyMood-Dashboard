<template>
  <edit-content
    v-loading="loading"
    :name="'thought'"
    :list1="emotionCycle.thought.template"
    :list2="emotionCycle.thought.thoughts"
    :list1-title="'Emotional Cycle Common Unhelpful Thoughts Template'"
    :list2-title="'Emotional Cycle Common Unhelpful Thoughts'"
    :placeholder="'New Common Unhelpful Thought'"
    @createPrepopulated="createThought"
    @updateTemplate="updateTemplate"
    @delete="deleteThought"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'ThoughtEditContent',
  components: { EditContent },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'emotionCycle'
    ])
  },
  created () {
    if (!this.emotionCycle.thought.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_THOUGHTS',
      'emotionCycle/SET_THOUGHT',
      'emotionCycle/SET_TTEMPLATE',
      'emotionCycle/SET_TTEMPLATEID'
    ]),
    createThought (thought) {
      this.loading = true
      prepopulatedService.createPrepopulated('thought', thought)
        .then(res => {
          this['emotionCycle/SET_THOUGHT'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteThought (id) {
      prepopulatedService.deletePrepopulated('thought', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('thought'),
        prepopulatedService.getPrepopulatedTemplate('thought')
      ])
        .then(([thoughts, template]) => {
          const ids = new Set(template.thoughts.map(e => e.id))
          this['emotionCycle/SET_THOUGHTS'](thoughts.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_TTEMPLATE'](template.thoughts)
          this['emotionCycle/SET_TTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.thought.templateId, 'thought', this.emotionCycle.thought.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
