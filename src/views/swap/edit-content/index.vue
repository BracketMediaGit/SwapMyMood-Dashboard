<template>
  <edit-content
    v-loading="loading"
    :name="'problem'"
    :list1="swap.template"
    :list2="swap.problems"
    :list1-title="'SWAPS Problems Template'"
    :list2-title="'SWAPS Problems'"
    :placeholder="'New Problem'"
    @createPrepopulated="createProblem"
    @updateTemplate="updateTemplate"
    @delete="deleteProblem"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import EditContent from '@/components/EditContent'

import prepopulatedService from '@/services/prepopulated'

export default {
  name: 'SwapProblemsEditContent',
  components: { EditContent },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'swap'
    ])
  },
  created () {
    if (!this.swap.template.length) this.getData()
  },
  methods: {
    ...mapMutations([
      'swap/SET_PROBLEMS',
      'swap/SET_PROBLEM',
      'swap/SET_TEMPLATE',
      'swap/SET_TEMPLATEID'
    ]),
    createProblem (problem) {
      this.loading = true
      prepopulatedService.createPrepopulated('problem', problem)
        .then(res => {
          this['swap/SET_PROBLEM'](res)
          this.problem = ''
          this.loading = false
        })
        .catch(err => console.log(err))
    },
    deleteProblem (id) {
      prepopulatedService.deletePrepopulated('problem', id)
        .then(res => console.log(res))
    },
    getData () {
      this.loading = true
      Promise.all([
        prepopulatedService.getPrepopulated('problem'),
        prepopulatedService.getPrepopulatedTemplate('problem')
      ])
        .then(([problems, template]) => {
          const ids = new Set(template.problems.map(p => p.id))
          this['swap/SET_PROBLEMS'](problems.filter(p => !ids.has(p.id)))
          this['swap/SET_TEMPLATE'](template.problems)
          this['swap/SET_TEMPLATEID'](template.id)
          this.loading = false
        })
    },
    updateTemplate () {
      prepopulatedService.updatePrepopulatedTemplate(this.swap.templateId, 'problem', this.swap.template)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>
