<template>
  <div class="components-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form>
          <el-form-item>
            <el-input v-model="prepopulated" :placeholder="[[placeholder]]" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createPrepopulated">Add {{ name }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="editor-container">
      <dnd-list :list1="list1" :list2="list2" :list1-title="list1Title" :list2-title="list2Title" v-on="$listeners" />
    </div>
    <div>
      <el-button type="primary" @click="updateTemplate">UPDATE</el-button>
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'

export default {
  name: 'EditContent',
  components: { DndList },
  props: {
    name: { type: String, default: '' },
    list1Title: { type: String, default: '' },
    list2Title: { type: String, default: '' },
    list1: { type: Array, default: () => [] },
    list2: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' }
  },
  data () {
    return {
      prepopulated: ''
    }
  },
  methods: {
    createPrepopulated () {
      this.$emit('createPrepopulated', this.prepopulated)
      this.prepopulated = ''
    },
    updateTemplate () {
      this.$emit('updateTemplate')
    }
  }
}
</script>
