<template>
  <edit-content
    v-loading="loading"
    :name="'emotion'"
    :list1="emotionCycle.emotion.template"
    :list2="emotionCycle.emotion.emotions"
    :list1-title="'Emotion Cycle Common Emotions Template'"
    :list2-title="'Emotion Cycle Common Emotions'"
    :placeholder="'New Emotion'"
    @createPrepopulated="createEmotion"
    @updateTemplate="updateTemplate"
    @delete="deleteEmotion"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'EmotionEditContent',
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
    if (!this.emotionCycle.emotion.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_EMOTIONS',
      'emotionCycle/SET_EMOTION',
      'emotionCycle/SET_ETEMPLATE',
      'emotionCycle/SET_ETEMPLATEID'
    ]),
    createEmotion (emotion) {
      this.loading = true
      prepopulatedService.createPrepopulated('emotion', emotion)
        .then(res => {
          this['emotionCycle/SET_EMOTION'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteEmotion (id) {
      prepopulatedService.deletePrepopulated('emotion', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('emotion'),
        prepopulatedService.getPrepopulatedTemplate('emotion')
      ])
        .then(([emotions, template]) => {
          const ids = new Set(template.emotions.map(e => e.id))
          this['emotionCycle/SET_EMOTIONS'](emotions.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_ETEMPLATE'](template.emotions)
          this['emotionCycle/SET_ETEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.emotion.templateId, 'emotion', this.emotionCycle.emotion.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
