<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.wholebody.template"
    :list2="emotionCycle.sensations.wholebody.wholebody"
    :list1-title="'Emotion Cycle Whole Body Sensations Template'"
    :list2-title="'Emotion Cycle Whole Body Sensations'"
    :placeholder="'New Whole Body Sensation'"
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
  name: 'WholeBodyEditContent',
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
    if (!this.emotionCycle.sensations.wholebody.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_WHOLEBODYS',
      'emotionCycle/SET_WHOLEBODY',
      'emotionCycle/SET_WTEMPLATE',
      'emotionCycle/SET_WTEMPLATEID'
    ]),
    createSensation (wholebody) {
      this.loading = true
      prepopulatedService.createPrepopulated('wholebodySensation', wholebody)
        .then(res => {
          this['emotionCycle/SET_WHOLEBODY'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('wholebodySensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('wholebodySensation'),
        prepopulatedService.getPrepopulatedTemplate('wholebody')
      ])
        .then(([wholebodySensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_WHOLEBODYS'](wholebodySensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_WTEMPLATE'](template.sensations)
          this['emotionCycle/SET_WTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.wholebody.templateId, 'wholebody', this.emotionCycle.sensations.wholebody.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
