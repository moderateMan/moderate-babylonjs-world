import { defineComponent, ref, onMounted } from "vue";
import styles from "./index.module.scss";
import { Button } from "@arco-design/web-vue";
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

export default defineComponent({
  props: { msg: String },
  setup(props) {
    const store = useCounterStore();
    const { count } = storeToRefs(store);
    const { increment } = store;
    const msg = "Hello Moderate-vue-admin!";

    return () => {
      return (
        <div class={styles.content}>
          <div class="content">
            <div class="title">{msg}</div>
            <div class="info ml-3"> {"pinia中的状态：" + count.value}</div>
            <Button
              onClick={() => {
                increment();
              }}
              type="primary"
            >
              增加+
            </Button>
          </div>
        </div>
      );
    };
  },
});
