<template>
  <edit-content
    v-loading="loading"
    :name="'Sensation'"
    :list1="emotionCycle.sensations.head.template"
    :list2="emotionCycle.sensations.head.head"
    :list1-title="'Emotional Cycle Head, Face, Throat, Neck Sensations Template'"
    :list2-title="'Emotional Cycle Head, Face, Throat, Neck Sensations'"
    :placeholder="'New Head, Face, Throat, Neck Sensation'"
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
  name: 'HeadEditContent',
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
    if (!this.emotionCycle.sensations.head.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_HEADS',
      'emotionCycle/SET_HEAD',
      'emotionCycle/SET_HTEMPLATE',
      'emotionCycle/SET_HTEMPLATEID'
    ]),
    createSensation (head) {
      this.loading = true
      prepopulatedService.createPrepopulated('headSensation', head)
        .then(res => {
          this['emotionCycle/SET_HEAD'](res)
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteSensation (id) {
      prepopulatedService.deletePrepopulated('headSensation', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('headSensation'),
        prepopulatedService.getPrepopulatedTemplate('head')
      ])
        .then(([headSensations, template]) => {
          const ids = new Set(template.sensations.map(s => s.id))
          this['emotionCycle/SET_HEADS'](headSensations.filter(e => !ids.has(e.id)))
          this['emotionCycle/SET_HTEMPLATE'](template.sensations)
          this['emotionCycle/SET_HTEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.emotionCycle.sensations.head.templateId, 'head', this.emotionCycle.sensations.head.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
