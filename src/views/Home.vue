<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="blue-grey darken-4">
      <v-card tile class="blue-grey darken-4" flat>
        <v-card-title class="text-h2 justify-center blue-grey--text"
          >CAT</v-card-title
        >
        <v-list dense nav class="blue-grey darken-4">
          <v-list-item-group v-model="selectedItem" mandatory>
            <v-list-item
              v-for="(item, index) in navigationDrawer"
              :key="index"
              :to="item.route"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar app class="blue-grey darken-4 white--text" dense>
      <v-btn
        @click="toggleDrawer"
        small
        class="text-center mr-4"
        outlined
        style="color:#209e88"
      >
        <v-icon class="">mdi-menu</v-icon>
      </v-btn>
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>
    <v-main class="blue-grey lighten-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import orderTime from './orderTime'
import dataDetail from './dataDetail'
export default {
  name: 'App',

  components: {
    orderTime,
    dataDetail,
  },

  data: () => ({
    selectedItem: 1,
    drawer: true,
    navigationDrawer: [
      { text: '预约时间', icon: 'mdi-alarm', route: '/home/orderTime' },
      {
        text: '报名列表',
        icon: 'mdi-account-check',
        route: '/home/dataDetail',
      },
    ],
    //
  }),
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep {
  .v-list .v-list-item-group .v-list-item .v-list-item__title {
    color: white;
  }
  .v-list .v-list-item-group .v-list-item--active {
    color: white;
    background: #209e88;
  }
}
</style>
