import Layout from '@/layout'

const legalRouter = {
  path: '/legal',
  component: Layout,
  redirect: '/legal/index',
  meta: { roles: ['root'] },
  children: [
    {
      path: 'index',
      component: () => import('@/views/legal/index'),
      name: 'Legal',
      meta: { title: 'Legal', icon: 'documentation', roles: ['root'] }
    }
  ]
}

export default legalRouter
