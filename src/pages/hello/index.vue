<template>
    <div ref="gameContainer" class="containerLogin">
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, shallowRef, toRaw } from 'vue';
import { GameEngine } from "../../game/core/gameEngine"
import { GameLogic } from "../../game/core/gameLogic";
const gameContainer = ref()

const engine = ref<GameEngine>()
let logic = null;
const initGame = () => {
    let dom = gameContainer?.value;
    {
        let option = {
            seed: 114514,
            start: { x: 5000, y: 10, z: 5000 },
            bounds: {
                topLeft: {
                    x: 1000,
                    z: 1000,
                },
                bottomRight: {
                    x: 11000,
                    z: 11000,
                },
            },
            visualField: 36,
            frameUpdateBlock: 12,
        };
        logic = new GameLogic(option)
        engine.value = new GameEngine(dom, [], logic);
    }
}

onMounted(() => {
    initGame()

})
onUnmounted(() => {
    engine.value?.destroy()
})

</script>
        

        
        
<style lang="scss" scoped>
.containerLogin {
    width: 100%;
    height: 100%;
}
</style>