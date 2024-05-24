<template>
  <div id="app">
  <head-component></head-component>
  <SliderComponent></SliderComponent>
  <div class="center">
    <side-bar-left></side-bar-left>
     <router-view></router-view> <!--Caragara el Componente de mi Ruta  -->
    <side-bar></side-bar>
  </div>
  <div class="clearfix"></div>
  <footer-component></footer-component>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FooterComponent from './components/FooterComponent.vue'
import HeadComponent from './components/HeadComponent.vue'
import SideBar from './components/SideBar.vue'
import SideBarLeft from './components/SideBarLeft.vue'
import SliderComponent from './components/SliderComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeadComponent,
    SliderComponent,
    SideBar,
    FooterComponent,
    SideBarLeft
  }
})
</script>

<style>


@import './assets/css/styles.css';
</style>
