<template>
    <aside id="sidebar-left">
        <div class="sidebar-item">
            <h3 @click="abrirMenu">TOP Ligas</h3>
            <ul v-show="isMenuOpen">
                <li v-for="liga in ligas" :key="liga">
                    <router-link :to="'/camisetas/' + liga">{{ liga }}</router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from 'axios';

export default defineComponent({
    name: 'LeftSideBar',
    setup() {
        const isMenuOpen = ref(true);
        const ligas = ref([]);

        const abrirMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const getLigas = async () => {
            try {
                const response = await axios.get('http://localhost:3900/api/ligas');
                ligas.value = response.data.ligas;
            } catch (error) {
                console.error("Error ligas: ", error);
            }
        };

        onMounted(getLigas);

        return {
            isMenuOpen,
            abrirMenu,
            ligas
        };
    }
});
</script>

<style scoped>
#sidebar-left {
    width: 10%;
    float: left;
    background-color: #f7f7f7;
    padding: 20px;
    margin: 1%;
}

.sidebar-item {
    background: #f7f7f7;
    padding: 20px;
    cursor: pointer; 
}

.sidebar-item h3 {
    text-transform: uppercase;
    font-size: 18px;
    margin: 0px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 3px solid #eee;
}

.sidebar-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
    transition: max-height 0.3s ease; 
    overflow: hidden;
}

.sidebar-item ul li {
    margin-bottom: 10px;
}

.sidebar-item ul li a {
    display: block;
    padding: 5px 0;
    text-decoration: none;
    transition: color 0.3s ease;
}

.sidebar-item ul li a:hover {
    color: rgba(243, 48, 48, 1);
}
</style>
