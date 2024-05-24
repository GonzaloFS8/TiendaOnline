// quasar-user-options.js
import { Notify } from 'quasar';

export default {
  config: {},
  plugins: {
    Notify
  },
  extras: [
    'material-icons'
  ],
  framework: {
    components: [
      'QBtn',
      'QIcon',
      'QCard',
      'QCardSection',
      'QCardActions',
      'QLayout',
      'QHeader',
      'QDrawer',
      'QPageContainer',
      'QPage',
      'QToolbar',
      'QToolbarTitle',
      'QList',
      'QItem',
      'QItemSection',
      'QItemLabel',
      'QInput',
      'QCarousel',
      'QCarouselControl',
      'QCarouselSlide',
      'QImg'
    ],
    directives: [
      'Ripple'
    ]
  }
};
