import { createApp } from "vue";
import nexaUi from "nexa-ui";
import "nexa-ui/style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(nexaUi);
app.mount("#app");
