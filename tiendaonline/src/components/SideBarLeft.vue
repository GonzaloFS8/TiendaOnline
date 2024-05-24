<template>
    <aside id="sidebar-left">
        <div class="sidebar-item">
            <h3 @click="toggleMenu">TOP Ligas</h3>
            <ul v-show="isMenuOpen">
                <li><a href="#">Serie A</a></li>
                <li><a href="#">La Liga</a></li>
                <li><a href="#">Premier</a></li>
                <li><a href="#">Bundesliga</a></li>
            </ul>
        </div>
    </aside>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: 'LeftSideBar',
    setup() {
        const isMenuOpen = ref(true);

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        return {
            isMenuOpen,
            toggleMenu
        };
    }
});
</script>
<style >
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