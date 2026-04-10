import Layout from '@/layout'

const swapRouter = {
  path: '/swap',
  component: Layout,
  name: 'Swap',
  meta: {
    title: 'SWAPS',
    icon: 'stop'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/swap/list-swap/index'),
      name: 'SwapList',
      meta: { title: 'List SWAPS', icon: 'stop', affix: false }
    },
    {
      path: 'edit-content',
      component: () => import('@/views/swap/edit-content/index'),
      name: 'SwapEditContent',
      meta: { title: 'Edit SWAPS Content', icon: 'stop', affix: false, roles: ['root'] }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/swap/detail/index'),
      name: 'SwapDetail',
      hidden: true,
      meta: { title: 'SWAPS Details' }
    }
  ]
}

export default swapRouter
