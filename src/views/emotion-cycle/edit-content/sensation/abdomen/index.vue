<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.abdomen.template"
    :list2="emotionCycle.sensations.abdomen.abdomen"
    :list1-title="'Emotional Cycle Abdomen Sensations Template'"
    :list2-title="'Emotional Cycle Abdomen Sensations'"
    :placeholder="'New Abdomen Sensation'"
    @createPrepopulated="createSensation"
    @updateTemplate="updateTemplate"
    @delete="deleteSensation"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'AbdomenEditContent',
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
    if (!this.emotionCycle.sensations.abdomen.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_ABDOMENS',
      'emotionCycle/SET_ABDOMEN',
      'emotionCycle/SET_ATEMPLATE',
      'emotionCycle/SET_ATEMPLATEID'
    ]),
    createSensation (abdomen) {
      this.loading = true
      prepopulatedService.createPrepopulated('abdomenSensation', abdomen)
        .then(res => {
          this['emotionCycle/SET_ABDOMEN'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('abdomenSensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('abdomenSensation'),
        prepopulatedService.getPrepopulatedTemplate('abdomen')
      ])
        .then(([abdomenSensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_ABDOMENS'](abdomenSensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_ATEMPLATE'](template.sensations)
          this['emotionCycle/SET_ATEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.abdomen.templateId, 'abdomen', this.emotionCycle.sensations.abdomen.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
