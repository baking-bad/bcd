<template>
  <v-navigation-drawer app fixed mini-variant permanent class="elevation-1">
    <router-link
      :to="{name: 'home'}"
      class="d-flex justify-center align-center"
      style="height: 63px"
    >
      <v-avatar color="primary" size="38">
        <span class="white--text">BCD</span>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-list-item-group>
        <template v-for="(item, idx) in publicItems">
          <v-tooltip :key="idx" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="{name: item.to}" v-on="on" active-class="primary--text">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <v-icon v-if="active" color="primary">{{ item.icon }}</v-icon>
                    <v-icon v-else color="grey">{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>

    <router-link
      :to="{name: 'home'}"
      class="d-flex justify-center align-center"
      style="height: 63px"
    >
      <v-avatar color="primary" size="38">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/4.jpg"></v-img>
      </v-avatar>
    </router-link>

    <v-list nav>
      <v-list-item-group>
        <template v-for="(item, idx) in privateItems">
          <v-tooltip :key="idx" right>
            <template v-slot:activator="{ on }">
              <v-list-item :to="{name: item.to}" v-on="on" active-class="primary--text">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <v-icon v-if="active" color="primary">{{ item.icon }}</v-icon>
                    <v-icon v-else color="grey">{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </template>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    publicItems: [
      {
        icon: "mdi-layers-search-outline",
        text: "Advanced search",
        to: "search"
      },
      {
        icon: "mdi-rhombus-split",
        text: "Projects",
        to: "projects"
      }
    ],
    privateItems: [
      {
        icon: "mdi-file-document-box-multiple-outline",
        text: "Contracts",
        to: "search"
      },
      {
        icon: "mdi-poll",
        text: "Statistics",
        to: "projects"
      }
    ]
  })
};
</script>