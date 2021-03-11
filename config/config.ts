import { defineConfig } from 'umi';
import SentryPlugin from '@sentry/webpack-plugin';

export default defineConfig({
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/m/sms/',
  publicPath: '/m/sms/',
  favicon: 'https://client.socialmaster.com.cn/assets/img/favicon.png',
  routes: [
    {
      path: '/',
      component: '@/index',
      routes: [
        {
          path: '/login',
          component: '@/components/Login/index',
        },
        {
          path: '/',
          component: '@/layouts/index',
          wrappers: ['@/wrappers/Authorized/index', '@/wrappers/GlobalData/index'],
          routes: [
            { path: '/', redirect: '/dashboard' },
            {
              path: '/dashboard',
              component: '@/pages/DashBoard/index',
              title: '看板',
            },
            {
              path: '/seedSet',
              exact: true,
              component: '@/pages/SeedSet/index',
              title: '种子集',
            },
            {
              path: '/seedSet/:seedSetId/detail',
              title: '种子集详情',
              component: '@/pages/SeedSet/Detail',
            },
            {
              path: '/datasource',
              component: '@/pages/Datasource/index',
              title: '数据源',
              routes: [
                {
                  exact: true,
                  title: '数据源列表',
                  path: '/datasource',
                  component: '@/pages/Datasource/List/index',
                },
                {
                  path: '/datasource/:resourceId',
                  component: '@/pages/Datasource/Detail/index',
                  title: '数据源详情',
                  routes: [
                    {
                      exact: true,
                      title: '数据源关联客户列表',
                      path: '/datasource/:resourceId/relationship',
                      component: '@/pages/Datasource/Detail/RelationshipList/index',
                    },
                    {
                      exact: true,
                      title: '数据源字段列表',
                      path: '/datasource/:resourceId/fieldList',
                      component: '@/pages/Datasource/Detail/FieldList/index',
                    },
                  ],
                },
              ],
            },
            {
              path: '/customer',
              component: '@/pages/Customer/index',
              title: '外部客户',
              routes: [
                {
                  exact: true,
                  title: '客户列表',
                  path: '/customer',
                  component: '@/pages/Customer/List/index',
                },
                {
                  exact: true,
                  path: '/customer/:customerId/detail',
                  component: '@/pages/Customer/SeedSetDetail/index',
                  title: '种子集详情',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  devServer: { port: 3114 },
  hash: true,
  define: {
    BASE_PATH: '/m/sms/api/v1',
  },
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed',
  },
  // chainWebpack: (config, { webpack }) => {
  //   config.plugin('sentry').use(SentryPlugin, [
  //     {
  //       release: '1.0.0',
  //       include: '.',
  //       ignore: ['node_modules'],
  //       urlPrefix: '~/static',
  //       configFile: 'sentry.properties',
  //     },
  //   ]);
  // },
});
